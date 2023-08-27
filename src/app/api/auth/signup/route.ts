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

    const { email, password, username } = signUpSchema.parse(body);

    const hash = await argon2.hash(password);

    const newUser = await db.user.create({
      data: {
        user_username: username,
        user_email: email,
        user_password: hash,
      },
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("jwt secret is not defined");
    }

    const access_token = jwt.sign(
      {
        id: newUser.user_id,
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
