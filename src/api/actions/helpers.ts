import fetch from "cross-fetch";

export const makeApiCall = async <T>(
  url: string,
  method: "GET" | "POST",
  body?: string | Record<string, unknown> | Buffer
): Promise<T> => {
  const headers: Record<string, string> = {};

  if (body) {
    if (typeof body !== "string" && !Buffer.isBuffer(body)) {
      body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(url, {
    method,
    body,
    headers,
  });

  if (res.status !== 200) {
    throw Error(`Request failed with code ${res.status}: ${await res.text()}`);
  }

  const returnedBody = await res.json();
  return returnedBody as T;
};

export const ipfsHashToUrl = (hash: string): string => {
  return `https://ipfs.fleek.co/ipfs/${hash}`;
};
