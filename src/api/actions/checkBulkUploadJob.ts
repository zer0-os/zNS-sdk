import { Maybe } from "../../utilities";
import { UploadJobStatus } from "../../types";
import { makeApiCall } from "./helpers";

export const checkBulkUploadJob = async (
  apiUri: string,
  jobIds: string[]
): Promise<UploadJobStatus[]> => {
  let response: Maybe<UploadJobStatus[]>;
  try {
    response = await makeApiCall<UploadJobStatus[]>(
      `${apiUri}/background/checkBulk`,
      "POST",
      { jobIds: jobIds }
    );
  } catch (e) {
    throw Error(`Check Job status failed: ${e}`);
  }

  return response;
};
