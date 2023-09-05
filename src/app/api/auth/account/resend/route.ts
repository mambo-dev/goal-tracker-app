import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import verifyAuth from "@/lib/auth";
import { db } from "@/lib/prisma";

import sendEmail from "@/lib/sendemail";
import { verificationResendHtml } from "@/lib/emailhtmls";
import { uuid } from "uuidv4";

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

    const newCode = uuid();

    const updatedAccount = await db.account.update({
      where: {
        account_user_id: findUser.user_id,
      },
      data: {
        account_verified_code: newCode,
      },
    });

    await sendEmail({
      to: findUser.user_email,
      from: "mambo.michael.22@gmail.com",
      subject: "Verification Resend",
      html: verificationResendHtml(
        `We love to see you here use this code to verify your account ${updatedAccount.account_verified_code}`,
        "link"
      ),
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
