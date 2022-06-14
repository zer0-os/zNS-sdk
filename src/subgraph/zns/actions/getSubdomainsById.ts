import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../../types";
import { getLogger } from "../../../utilities";
import * as queries from "../queries";
import { DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "../../helpers";

const logger = getLogger().withTag("subgraph:actions:getSubdomainsById");

export const getSubdomainsById = async <T>(
  apolloClient: ApolloClient<T>,
  domainId: string
): Promise<Domain[]> => {
  const queryCount = 1000;
  let skip = 0;

  const domains: Domain[] = [];

  while (true) {
    logger.trace(
      `Querying for ${queryCount} subdomains of ${domainId} starting at indexId ${skip}`
    );

    const queryResult = await performQuery<DomainsQueryDto>(
      apolloClient,
      queries.getSubdomainsById,
      { parent: domainId, count: queryCount, startIndex: skip }
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
    if (queriedDomains.length < queryCount) {
      break;
    }
    skip = queriedDomains[queriedDomains.length - 1].indexId;
  }

  logger.trace(`Found ${domains.length} subdomains of ${domainId}`);

  return domains;
};
