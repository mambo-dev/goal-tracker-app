import { ServerResponse } from "@/lib/types";

type SignInDetails = {
  password: string;
  username: string;
};

export default async function signIn(
  signInDetails: SignInDetails
): Promise<{ two_factor: boolean }> {
  const res = await fetch(`/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(signInDetails),
  });

  const data = (await res.json()) as ServerResponse<{
    two_factor: boolean;
  }>;

  if (!data.okay || !data.data) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }

  return {
    two_factor: data.data.two_factor,
  };
}
