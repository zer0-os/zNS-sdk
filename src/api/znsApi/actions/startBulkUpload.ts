import { Maybe, UrlToJobId } from "../../../types";
import { makeApiCall } from "../../helpers";

export const startBulkUpload = async (
  apiUri: string,
  urls: string[]
): Promise<UrlToJobId> => {
  let response: Maybe<UrlToJobId>;
  try {
    response = await makeApiCall<UrlToJobId>(
      `${apiUri}/background/startBulk`,
      "POST",
      { urls: urls }
    );
  } catch (e) {
    throw Error(`Bulk upload failed: ${e}`);
  }

  return response;
};
