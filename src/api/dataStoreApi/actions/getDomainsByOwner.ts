import { Domain, Maybe } from "../../../types";
import { DomainCollection } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";
import { datastoreDomainToDomain } from "../helpers/datastoreDomainToDomain";

export const getDomainsByOwner = async (
  apiUri: string,
  ownerAddress: string,
  limit = 1000
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  try {
    // Set default limit up to 1000 to match the subgraph maximum
    response = await makeApiCall<DomainCollection>(
      `${apiUri}v1/domains/search/owner/${ownerAddress}?projection=false&limit=${limit}&sort=domainId&sortDirection=asc`,
      "GET"
    );
  } catch (e) {
    throw Error(`Failed to get domains for owner ${ownerAddress}: ${e}`);
  }

  // Map from DataStoreDomain -> Domain for downstream consistency
  const domains: Domain[] = response.results.map((d) => {
    return datastoreDomainToDomain(d);
  });

  return domains;
};
