import { ServerResponse } from "../types";

interface FetchData {
  method: "PUT" | "POST" | "DELETE" | "GET";
  url: string;
  body?: BodyInit | null;
}

export default async function fetchDataFromApi({
  url,
  method,
  body,
}: FetchData) {
  try {
    let data: ServerResponse<boolean> | undefined;

    if (method === "POST" || method === "PUT") {
      if (!body) throw new Error("a body is required for this methods");

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json",
        },
        body: body,
      });
      data = (await res.json()) as ServerResponse<boolean>;
    } else if (method === "DELETE" || method === "GET") {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json",
        },
      });
      data = (await res.json()) as ServerResponse<boolean>;
    }

    if (!data) {
      throw new Error("no data was received from the api");
    }

    if (!data.okay) {
      if (data.error instanceof Array) {
        throw new Error(JSON.stringify(data.error));
      }

      throw new Error(data.error ?? "something unexpected happened");
    }

    return data.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
