import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

import jwt from "jsonwebtoken";
import { db } from "./prisma";
import { AuthorizedUser, DecodedToken } from "./types";

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
