import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../types";
import * as queries from "../queries";
import { DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "./helpers";

export const getMostRecentDomains = async <T>(
  apolloClient: ApolloClient<T>,
  count: number = 100
): Promise<Domain[]> => {
  const domains: Domain[] = [];

  while (true) {
    const queryResult = await performQuery<DomainsQueryDto>(
      apolloClient,
      queries.getPastNDomains,
      { count: count }
    );

    const queriedDomains = queryResult.data.domains;
    for (const domain of queriedDomains) {
      domains.push(convertDomainDtoToDomain(domain));
    }

    /**
     * We will only get back up to `count` # of domains
     * So if we get that many there's probably more domains we need
     * to fetch. If we got back less, we can stop querying
     */
    if (queriedDomains.length < count) {
      break;
    }
  }

  return domains;
};
