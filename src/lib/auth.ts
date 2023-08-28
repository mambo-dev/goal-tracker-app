import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

import jwt from "jsonwebtoken";
import { db } from "./prisma";
import { AuthorizedUser, DecodedToken, UserExistsAndAuthorized } from "./types";
import { cookies } from "next/headers";

export default async function verifyAuth(
  authorizationString: string | undefined
): Promise<AuthorizedUser> {
  try {
    if (!authorizationString) {
      return {
        error: "No authorization provided",
      };
    }

    const JWT_SECRET = process.env.JWT_SECRET as unknown as string;

    if (!process.env.JWT_SECRET) {
      throw new Error("jwt secret is not defined");
    }

    const decoded = jwt.verify(authorizationString, JWT_SECRET) as DecodedToken;

    if (!decoded) {
      return {
        error: "Invalid token or user doesn't exist",
      };
    }

    const authorizedUser = await db.user.findUnique({
      where: {
        user_id: decoded.id,
      },
    });

    if (!authorizedUser) {
      return {
        error: "this account may have been deleted",
      };
    }

    const { user_id, user_username } = authorizedUser;

    return {
      user: {
        user_id: user_id,
        username: user_username,
      },
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function userExistsAndAuthorized(): Promise<UserExistsAndAuthorized> {
  const cookie = cookies();

  const access_token = cookie.get("access_token");

  if (!cookie) {
    return {
      okay: false,
      message: "sorry try signing in again",
    };
  }

  const { user, error } = await verifyAuth(access_token?.value);

  if (error || !user) {
    return {
      okay: false,
      message: error,
    };
  }

  const findUser = await db.user.findUnique({
    where: {
      user_id: user.user_id,
    },
  });

  if (!findUser) {
    return {
      okay: false,
      message: "could not find user try signing up first",
    };
  }

  return {
    okay: true,
    user: findUser,
  };
}
