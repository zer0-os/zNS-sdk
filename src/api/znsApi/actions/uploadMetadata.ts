import { DomainMetadata, Maybe } from "../../../types";
import { UploadedFileDto } from "../types";
import { ipfsHashToUrl, makeApiCall } from "../../helpers";

export const uploadMetadata = async (
  apiUri: string,
  metadata: DomainMetadata
): Promise<string> => {
  let response: Maybe<UploadedFileDto>;
  try {
    response = await makeApiCall<UploadedFileDto>(
      `${apiUri}/upload`,
      "POST",
      metadata
    );
  } catch (e) {
    throw Error(`Failed to upload metadata: ${e}`);
  }

  const url = ipfsHashToUrl(response.hash);
  return url;
};
