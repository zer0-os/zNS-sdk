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
  let skip = 0;
  let yetUnreceived = count;

  while (true) {
    const queryResult = await performQuery<DomainsQueryDto>(
      apolloClient,
      queries.getPastNDomains,
      { count: yetUnreceived, startIndex: skip }
    );

    const queryResults = queryResult.data.domains;
    for (const domain of queryResults) {
      domains.push(convertDomainDtoToDomain(domain));
    }

    skip += queryResults.length;
    yetUnreceived -= queryResults.length;

    if (yetUnreceived <= 0) {
      break;
    }
  }

  return domains;
};
