import { UploadedFileDto } from "../types";
import { makeApiCall } from "../../helpers";
import { Maybe } from "../../../types";

export const uploadObject = async (
  apiUri: string,
  object: Record<string, unknown>
): Promise<string> => {
  let response: Maybe<UploadedFileDto>;
  try {
    response = await makeApiCall<UploadedFileDto>(
      `${apiUri}/upload`,
      "POST",
      object
    );
  } catch (e) {
    throw Error(`Failed to upload object: ${e}`);
  }

  const url = response.url;
  return url;
};
