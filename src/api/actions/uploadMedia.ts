import { Maybe } from "../../utilities";
import { UploadedFileDto } from "../types";
import { ipfsHashToUrl, makeApiCall } from "./helpers";

export const uploadMedia = async (
  apiUri: string,
  media: Buffer
): Promise<string> => {
  let response: Maybe<UploadedFileDto>;
  try {
    response = await makeApiCall<UploadedFileDto>(
      `${apiUri}/uploadCloudinary`,
      "POST",
      media
    );
  } catch (e) {
    throw Error(`Failed to upload metadata: ${e}`);
  }

  const url = response.url;
  return url;
};
