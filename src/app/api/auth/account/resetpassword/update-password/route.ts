import { db } from "@/lib/prisma";
import { updatePasswordSchema } from "@/lib/schemas";
import { ServerResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";
import * as argon2 from "argon2";
import { uuid } from "uuidv4";

export async function PUT(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();

    const { email, password, resetCode } = updatePasswordSchema.parse(body);

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

    if (findUser.user_account.account_reset_password_code !== resetCode) {
      return NextResponse.json(
        {
          error: [
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
        user_account: {
          update: {
            account_reset_password_code: uuid(),
          },
        },
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
