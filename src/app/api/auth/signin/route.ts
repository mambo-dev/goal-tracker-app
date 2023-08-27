import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { signUpSchema } from "@/lib/schemas";
import * as argon2 from "argon2";
import { db } from "@/lib/prisma";

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();

    const { username, password } = signUpSchema.parse(body);

    const findUser = await db.user.findUnique({
      where: {
        user_username: username,
      },
    });

    if (!findUser) {
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

    const verifyPassword = await argon2.verify(
      findUser.user_password,
      password
    );

    if (!verifyPassword) {
      return NextResponse.json(
        {
          message: [
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
