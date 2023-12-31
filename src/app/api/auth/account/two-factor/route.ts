import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import verifyAuth from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";
import { twoFactorSchema } from "@/lib/schemas";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { uuid } from "uuidv4";

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("missing jwt credentials");
  }
  return process.env.JWT_SECRET;
}

// enable two factor
export async function GET(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const cookie = cookies();

    const access_token = cookie.get("access_token");
    if (!cookie) {
      return NextResponse.json(
        {
          error: [
            {
              message: "could not retrive cookies",
            },
          ],
          okay: false,
        },
        { status: 400 }
      );
    }

    const { user, error } = await verifyAuth(access_token?.value);

    if (error || !user) {
      return NextResponse.json(
        {
          error: [
            {
              message: error,
            },
          ],
          okay: false,
        },
        { status: 403 }
      );
    }

    const findUser = await db.user.findUnique({
      where: {
        user_id: user.user_id,
      },
      include: {
        user_account: true,
      },
    });

    if (!findUser || !findUser.user_account) {
      return NextResponse.json(
        {
          error: [
            {
              message: "could not find user try signing up first",
            },
          ],
          okay: false,
        },
        {
          status: 404,
        }
      );
    }

    await db.account.update({
      where: {
        account_user_id: findUser.user_id,
      },
      data: {
        account_two_factor: true,
      },
    });

    return NextResponse.json(
      {
        data: true,
        okay: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: [
          {
            message: "something went wrong with the server",
          },
        ],
        okay: false,
      },
      {
        status: 500,
      }
    );
  }
}

// confirm two factor code

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const { twoFactorCode } = twoFactorSchema.parse(body);

    if (!username) {
      throw new Error("invalid username value sent");
    }

    const findUser = await db.user.findUnique({
      where: {
        user_username: username,
      },
      include: {
        user_account: true,
      },
    });

    if (!findUser || !findUser.user_account) {
      return NextResponse.json(
        {
          error: [
            {
              message: "could not find user try signing up first",
            },
          ],
          okay: false,
        },
        {
          status: 404,
        }
      );
    }

    if (findUser.user_account.account_two_factor_code !== twoFactorCode) {
      return NextResponse.json(
        {
          error: [
            {
              message: "the  code did not match please try again",
            },
          ],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    await db.account.update({
      where: {
        account_user_id: findUser.user_id,
      },
      data: {
        account_two_factor: true,
        account_two_factor_code: uuid(),
      },
    });

    const access_token = jwt.sign(
      {
        id: findUser.user_id,
      },
      getJwtSecret()
    );

    return NextResponse.json(
      {
        data: true,
        okay: true,
      },
      {
        headers: {
          "Set-Cookie": cookie.serialize("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 120,
            sameSite: "strict",
            path: "/",
          }),
        },
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
          okay: false,
        },
        {
          status: 403,
        }
      );
    }
    return NextResponse.json(
      {
        error: [
          {
            message: "something went wrong with the server",
          },
        ],
        okay: false,
      },
      {
        status: 500,
      }
    );
  }
}
