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
      user: null,
      message: "sorry try signing in again",
    };
  }

  const { user, error } = await verifyAuth(access_token?.value);

  if (error || !user) {
    return {
      user: null,
      message: error,
    };
  }

  const findUser = await db.user.findUnique({
    where: {
      user_id: user.user_id,
    },
    include: {
      user_account: {
        select: {
          account_verified: true,
          account_two_factor: true,
          account_reset_password_code: false,
          account_id: false,
          account_user: false,
          account_two_factor_code: false,
          account_verified_code: false,
        },
      },
    },
  });

  if (!findUser) {
    return {
      user: null,
      message: "could not find user try signing up first",
    };
  }

  if (!findUser.user_account) {
    return {
      user: null,
      message: "could not find an account associated with this user",
    };
  }

  const returnUser = {
    user_id: findUser.user_id,
    user_username: findUser.user_username,
    user_email: findUser.user_email,
    user_password: findUser.user_password,
    account_verified: findUser.user_account.account_two_factor,
    account_two_factor: findUser.user_account.account_verified,
  };

  return {
    user: returnUser,
  };
}
