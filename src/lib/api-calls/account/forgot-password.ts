import { ServerResponse } from "@/lib/types";

export async function requestResetPassword(email: string): Promise<boolean> {
  const res = await fetch(`/api/auth/account/resetpassword/request-reset`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = (await res.json()) as ServerResponse<boolean>;
  if (!data.okay || !data.data) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }

  return data.data;
}
