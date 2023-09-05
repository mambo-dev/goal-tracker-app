import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import verifyAuth from "@/lib/auth";
import { db } from "@/lib/prisma";
import { verifyEmailSchema } from "@/lib/schemas";
import { z } from "zod";

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const cookie = cookies();
    const body = request.json();

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
          message: [
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

    const { verificationCode } = verifyEmailSchema.parse(body);

    if (findUser.user_account.account_verified_code !== verificationCode) {
      return NextResponse.json(
        {
          message: [
            {
              message: "the verification code did not match please try again",
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
        account_verified: true,
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
