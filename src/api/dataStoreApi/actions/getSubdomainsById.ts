import { Maybe } from "../../../utilities";
import { Domain, DomainCollection } from "../../../types";
import { makeApiCall } from "../../helpers";
import * as dotenv from "dotenv";

dotenv.config();

export const getSubdomainsById = async (
  tokenId: string,
  apiUri: string,
  header: Record<string, string>
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;

  try {
    response = await makeApiCall<DomainCollection>(
      `${apiUri}domains/subdomains/${tokenId}`,
      "POST",
      undefined,
      header
    );
  } catch (e) {
    throw Error(`Check Job status failed: ${e}`);
  }

  return response.result;
};
