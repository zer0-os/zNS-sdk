import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../types";
import { getLogger } from "../../utilities";
import * as queries from "../queries";
import { DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "./helpers";

const logger = getLogger().withTag("subgraph:actions:getRecentSubdomainsById");
const MAX_RECORDS = 5000;

export const getMostRecentSubdomainsById = async <T>(
  apolloClient: ApolloClient<T>,
  domainId: string,
  count = 1000
): Promise<Domain[]> => {
  let skip = 0;
  const domains: Domain[] = [];
  let yetUnreceived = count;

  
  if (count >= MAX_RECORDS) {
    throw new Error(
      `Please request no more than ${MAX_RECORDS} records at a time.`
    );
  }
  while (true) {
    logger.trace(
      `Querying for ${yetUnreceived} recent subdomains of ${domainId} starting at indexId ${skip}`
    );

    const queryResult = await performQuery<DomainsQueryDto>(
      apolloClient,
      queries.getRecentSubdomainsById,
      { parent: domainId, count: yetUnreceived, startIndex: skip }
    );

    const queriedDomains = queryResult.data.domains;
    for (const domain of queriedDomains) {
      domains.push(convertDomainDtoToDomain(domain));
    }

    /**
     * We will only get back up to `queryCount` # of domains
     * So if we get that many there's probably more domains we need
     * to fetch. If we got back less, we can stop querying
     */
     yetUnreceived -= queriedDomains.length;
    if (queriedDomains.length < count || yetUnreceived <= 0) {
      break;
    }
    skip = queriedDomains[queriedDomains.length - 1].indexId;
  }

  logger.trace(`Found ${domains.length} recent subdomains of ${domainId}`);

  return domains;
};
