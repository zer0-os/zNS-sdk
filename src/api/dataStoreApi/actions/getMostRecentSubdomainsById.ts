import { Domain, Maybe } from "../../../types";
import { DomainCollection } from "../types";
import { makeApiCall } from "../../helpers";
import { ethers } from "ethers";
import { getLogger } from "../../../utilities";
import { datastoreDomainToDomain } from "../helpers/datastoreDomainToDomain";

const logger = getLogger().withTag("datastore:actions:getRecentSubdomainsById");
const MAX_RECORDS = 5000;

export const getMostRecentSubdomainsById = async (
  apiUri: string,
  tokenId: string,
  limit: number,
  skip: number
): Promise<Domain[]> => {
  let response: Maybe<DomainCollection>;
  if (limit >= MAX_RECORDS) {
    throw new Error(
      `Please request no more than ${MAX_RECORDS} records at a time.`
    );
  }

  try {
    logger.trace(
      `Querying for ${limit} recent subdomains of ${tokenId} starting at indexId ${skip}`
    );

    const requestUri = `${apiUri}v1/domains/subdomains/deep/${tokenId}?sortDirection=-1&sort=created&skip=${skip}&limit=${limit}`;

    response = await makeApiCall<DomainCollection>(requestUri, "GET");
  } catch (e) {
    throw Error(`Failed to get recently created domains for ${tokenId}: ${e}`);
  }

  // Map from DataStoreDomain -> Domain for downstream consistency
  const domains: Domain[] = response.results.map((d) => {
    return datastoreDomainToDomain(d);
  });

  return domains;
};
