import { Domain, Maybe } from "../../../types";
import { DataStoreDomain } from "../types";
import { makeApiCall } from "../../helpers";
import { datastoreDomainToDomain } from "../helpers/datastoreDomainToDomain";

export const getDomainById = async (
  apiUri: string,
  domainId: string
): Promise<Domain> => {
  let response: Maybe<DataStoreDomain>;
  try {
    response = await makeApiCall<DataStoreDomain>(
      `${apiUri}v1/domains/get/${domainId}`,
      "GET"
    );
  } catch (e) {
    throw Error(`Failed to get domain: ${domainId}`);
  }

  // Map from DataStoreDomain -> Domain for downstream consistency
 return datastoreDomainToDomain(response);
};
