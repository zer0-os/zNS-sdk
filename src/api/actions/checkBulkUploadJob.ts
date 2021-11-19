import { Maybe } from "../../utilities";
import { UploadJobStatus } from "../../types";
import { makeApiCall } from "./helpers";

export const checkBulkUploadJob = async (
  apiUri: string,
  urls: string[]
): Promise<UploadJobStatus[]> => {
  let response: Maybe<UploadJobStatus[]>;
  try {
    response = await makeApiCall<UploadJobStatus[]>(
      `${apiUri}/checkBulk`,
      "POST",
      {urls: urls}
    );
  } catch (e) {
    throw Error(`Check Job status failed: ${e}`);
  }

  return response;
};
