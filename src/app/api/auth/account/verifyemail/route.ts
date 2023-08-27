import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const { searchParams } = new URL(request.url);

    const verificationCode = searchParams.get("verificationCode");

    if (!verificationCode) {
      throw new Error("invalid code value sent");
    }

    const findUser = await db.user.findUnique({
      where: {
        user_email: email,
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

    if (findUser.user_account.account_reset_password_code !== resetCode) {
      return NextResponse.json(
        {
          message: [
            {
              message: "the reset code did not match please try again",
            },
          ],
          okay: false,
        },
        {
          status: 403,
        }
      );
    }
    const hash = await argon2.hash(password);
    await db.user.update({
      where: {
        user_email: email,
      },
      data: {
        user_password: hash,
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
