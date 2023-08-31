import { NextResponse } from "next/server";
import cookie from "cookie";
import { ServerResponse } from "@/lib/types";

export async function GET(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    return NextResponse.json(
      {
        data: true,
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
