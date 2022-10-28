import { Domain, Maybe } from "../../../types";
import { DomainCollection } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";
import { datastoreDomainToDomain } from "../helpers/datastoreDomainToDomain";

export const getSubdomainsById = async (
  apiUri: string,
  tokenId: string,
  sortDirection: string = 'asc'
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  try {
    response = await makeApiCall<DomainCollection>(
      `${apiUri}v1/domains/subdomains/${tokenId}?projection=false&limit=0&sort=created&sortDirection=${sortDirection}`,
      "GET"
    );
  } catch (e) {
    throw Error(`Failed to get subdomains for ${tokenId}: ${e}`);
  }

 // Map from DataStoreDomain -> Domain for downstream consistency
 const domains: Domain[] = response.results.map((d) => {
  return datastoreDomainToDomain(d);
});

  return domains;
};
