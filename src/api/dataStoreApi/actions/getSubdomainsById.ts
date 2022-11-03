import { Domain, Maybe } from "../../../types";
import { DomainCollection } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";
import { datastoreDomainToDomain } from "../helpers/datastoreDomainToDomain";

export const getSubdomainsById = async (
  apiUri: string,
  tokenId: string,
  limit = 100,
  skip = 0,
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  try {
    response = await makeApiCall<DomainCollection>(
      `${apiUri}v1/domains/subdomains/${tokenId}?projection=false&skip=${skip}&limit=${limit}`,
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
