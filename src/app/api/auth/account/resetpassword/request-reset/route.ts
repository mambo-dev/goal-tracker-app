import { resetPasswordHtml } from "@/lib/emailhtmls";
import { db } from "@/lib/prisma";
import { requestResetSchema } from "@/lib/schemas";
import sendEmail from "@/lib/sendemail";
import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import { uuid } from "uuidv4";

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();

    const { email } = requestResetSchema.parse(body);

    const findUser = await db.user.findUnique({
      where: {
        user_email: email,
      },
    });

    if (!findUser) {
      return NextResponse.json(
        {
          data: true,
          okay: true,
        },
        {
          status: 200,
        }
      );
    }

    const resetCode = uuid();

    const userAccount = await db.account.update({
      where: {
        account_user_id: findUser.user_id,
      },
      data: {
        account_reset_password_code: resetCode,
      },
    });

    if (!process.env.WEB_URL) {
      throw new Error("set the current web url");
    }

    await sendEmail({
      to: findUser.user_email,
      from: "mambo.michael.22@gmail.com",
      subject: "Password Reset Code",
      html: resetPasswordHtml(
        `Hi, we received a request to change your password if this isn't you, you can safely ignore this email otherwise
        you reset password is  <strong>${userAccount.account_reset_password_code}</strong>`,
        `${process.env.WEB_URL}/account/forgot-password/reset-password?email=${findUser.user_email}&resetCode=${userAccount.account_reset_password_code}`
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
