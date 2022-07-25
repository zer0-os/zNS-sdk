import { ApolloClient } from "@apollo/client/core";

import { Domain } from "../../../types";
import { getLogger } from "../../../utilities";
import * as queries from "../queries";
import { DomainDto, DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "../../helpers";

const logger = getLogger().withTag("subgraph:actions:getAllDomains");

export const getAllDomains = async <T>(
  apolloClient: ApolloClient<T>
): Promise<Domain[]> => {
  const queryCount = 1000;
  let skip = 0;
  let queriedDomains: DomainDto[] = [];
  const domains: Domain[] = [];

  /**
   * We will only get back up to `queryCount` # of domains
   * So if we get that many there's probably more domains we need
   * to fetch. If we got back less, we can stop querying
   */
  do {
    logger.trace(
      `Querying for ${queryCount} domains starting at indexId ${skip}`
    );
    const queryResult = await performQuery<DomainsQueryDto>(
      apolloClient,
      queries.getAllDomains,
      { count: queryCount, startIndex: skip }
    );

    queriedDomains = queryResult.data.domains;
    for (const domain of queriedDomains) {
      domains.push(convertDomainDtoToDomain(domain));
    }
    console.log(queriedDomains[queriedDomains.length - 1]);
    skip = parseInt(queriedDomains[queriedDomains.length - 1].indexId) + 1;
  } while (queriedDomains.length >= queryCount);

  logger.trace(`Found ${domains.length} domains`);

  return domains;
};
