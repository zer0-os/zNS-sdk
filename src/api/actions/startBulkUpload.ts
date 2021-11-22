import { Maybe } from "../../utilities";
import { makeApiCall } from "./helpers";

export const startBulkUpload = async (
  apiUri: string,
  urls: string[]
): Promise<any> => {
  let response: Maybe<any>;
  try {
    response = await makeApiCall<any>(
      `${apiUri}/background/startBulk`,
      "POST",
      { urls: urls }
    );
  } catch (e) {
    throw Error(`Bulk upload failed: ${e}`);
  }

  return response;
};
