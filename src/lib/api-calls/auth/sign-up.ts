import { ServerResponse } from "@/lib/types";

type SignUpDetails = {
  confirmPassword: string;
  email: string;
  password: string;
  username: string;
};

export default async function signUp(signUpDetails: SignUpDetails) {
  const res = await fetch(`/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(signUpDetails),
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (!data.okay) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }

  return data.data;
}
