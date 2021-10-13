import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../types";
import * as queries from "../queries";
import { DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "./helpers";

export const getSubdomainsById = async <T>(
  apolloClient: ApolloClient<T>,
  domainId: string
): Promise<Domain[]> => {
  const queryCount = 1000;
  let skip = 0;

  const domains: Domain[] = [];

  while (true) {
    const queryResult = await performQuery<DomainsQueryDto>(
      apolloClient,
      queries.getSubdomainsById,
      { parent: domainId, count: queryCount, skipAmount: skip }
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
    skip += queriedDomains.length;
  }

  return domains;
};
