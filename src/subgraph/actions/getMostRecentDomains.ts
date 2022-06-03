import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../types";
import * as queries from "../queries";
import { DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "./helpers";

const MAX_RECORDS = 5000;

export const getMostRecentDomains = async <T>(
  apolloClient: ApolloClient<T>,
  count = 100,
  skip = 0
): Promise<Domain[]> => {
  const domains: Domain[] = [];
  let yetUnreceived = count;

  if (count >= MAX_RECORDS) {
    throw new Error(
      `Please request no more than ${MAX_RECORDS} records at a time.`
    );
  }

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

    if (yetUnreceived <= 0 || queryResults.length == 0) {
      break;
    }
  }

  return domains;
};
