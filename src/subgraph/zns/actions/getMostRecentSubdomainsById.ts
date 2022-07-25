import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../../types";
import { getLogger } from "../../../utilities";
import * as queries from "../queries";
import { DomainDto, DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "../../helpers";

const logger = getLogger().withTag("subgraph:actions:getRecentSubdomainsById");
const MAX_RECORDS = 5000;

export const getMostRecentSubdomainsById = async <T>(
  apolloClient: ApolloClient<T>,
  domainId: string,
  count = 1000,
  skip = 0
): Promise<Domain[]> => {
  const subDomains: Domain[] = [];
  let yetUnreceived = count;
  let queriedDomains: DomainDto[] = [];
  if (count >= MAX_RECORDS) {
    throw new Error(
      `Please request no more than ${MAX_RECORDS} records at a time.`
    );
  }
  /**
   * We will only get back up to `queryCount` # of domains
   * So if we get that many there's probably more domains we need
   * to fetch. If we got back less, we can stop querying
   */
  do {
    logger.trace(
      `Querying for ${yetUnreceived} recent subdomains of ${domainId} starting at indexId ${skip}`
    );

    const queryResult = await performQuery<DomainsQueryDto>(
      apolloClient,
      queries.getRecentSubdomainsById,
      { parent: domainId, count: yetUnreceived, startIndex: skip }
    );

    queriedDomains = queryResult.data.domains;
    for (const domain of queriedDomains) {
      subDomains.push(convertDomainDtoToDomain(domain));
    }
    yetUnreceived -= queriedDomains.length;
    skip = parseInt(queriedDomains[queriedDomains.length - 1].indexId);
  } while (yetUnreceived > 0 && queriedDomains.length === count);
  logger.trace(`Found ${subDomains.length} recent subdomains of ${domainId}`);

  return subDomains;
};
