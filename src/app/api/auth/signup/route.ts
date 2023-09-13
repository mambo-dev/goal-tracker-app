import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { signUpSchema } from "@/lib/schemas";
import * as argon2 from "argon2";
import { db } from "@/lib/prisma";
import sendEmail from "@/lib/sendemail";
import { welcomeHtml } from "@/lib/emailhtmls";

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();

    const { email, password, username } = signUpSchema.parse(body);

    const userExists = await db.user.findFirst({
      where: {
        OR: [
          {
            user_username: username,
          },
          {
            user_email: email,
          },
        ],
      },
    });

    if (userExists) {
      return NextResponse.json({
        error: [
          {
            message:
              "This user already exists kindly try a different email or username",
          },
        ],
        okay: false,
      });
    }

    const hash = await argon2.hash(password);

    const newUser = await db.user.create({
      data: {
        user_username: username,
        user_email: email,
        user_password: hash,
      },
    });

    await db.analyticsTracker.create({
      data: {
        analytics_user: {
          connect: {
            user_id: newUser.user_id,
          },
        },
      },
    });

    const userAccount = await db.account.create({
      data: {
        account_user: {
          connect: {
            user_id: newUser.user_id,
          },
        },
      },
    });

    await sendEmail({
      to: newUser.user_email,
      from: "mambo.michael.22@gmail.com",
      subject: "Welcome to Goalee",
      html: welcomeHtml(
        `We love to see you here use this code to verify your account ${userAccount.account_verified_code}`,
        "link"
      ),
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
