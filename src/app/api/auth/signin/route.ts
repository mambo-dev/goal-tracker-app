import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { signInSchema } from "@/lib/schemas";
import * as argon2 from "argon2";
import { db } from "@/lib/prisma";
import sendEmail from "@/lib/sendemail";
import { twoFactorAuthenticationHtml } from "@/lib/emailhtmls";
import { uuid } from "uuidv4";

export async function POST(request: Request): Promise<
  NextResponse<
    ServerResponse<{
      two_factor: boolean;
    }>
  >
> {
  try {
    const body = await request.json();

    const { username, password } = signInSchema.parse(body);

    const findUser = await db.user.findUnique({
      where: {
        user_username: username,
      },
      include: {
        user_account: {
          select: {
            account_two_factor: true,
            account_user: false,
            account_two_factor_code: true,
          },
        },
      },
    });

    if (!findUser) {
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

    const verifyPassword = await argon2.verify(
      findUser.user_password,
      password
    );

    if (!verifyPassword) {
      return NextResponse.json(
        {
          error: [
            {
              message: "invalid password or username",
            },
          ],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("jwt secret is not defined");
    }

    const access_token = jwt.sign(
      {
        id: findUser.user_id,
      },
      process.env.JWT_SECRET
    );

    if (findUser.user_account?.account_two_factor) {
      const account = await db.account.update({
        where: {
          account_user_id: findUser.user_id,
        },
        data: {
          account_two_factor_code: uuid(),
        },
      });

      await sendEmail({
        to: findUser.user_email,
        from: "mambo.michael.22@gmail.com",
        subject: "Two factor Authentication",
        html: twoFactorAuthenticationHtml(
          `Kindly use this code to access your account ${account.account_two_factor_code}`,
          "link"
        ),
      });
      return NextResponse.json(
        {
          data: {
            two_factor: true,
          },
          okay: true,
        },
        {
          headers: {
            "Set-Cookie": cookie.serialize("access_token", "", {
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
    }

    return NextResponse.json(
      {
        data: {
          two_factor: false,
        },
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
