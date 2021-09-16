import fetch from "cross-fetch";

export const makeApiCall = async <T>(
  url: string,
  method: "GET" | "POST",
  body?: string | Record<string, unknown> | Buffer
): Promise<T> => {
  if (body) {
    if (typeof body !== "string" && !Buffer.isBuffer(body)) {
      body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, {
    method,
    body,
  });

  const returnedBody = await res.json();
  return returnedBody as T;
};

export const ipfsHashToUrl = (hash: string): string => {
  return `https://ipfs.fleek.co/ipfs/${hash}`;
};
