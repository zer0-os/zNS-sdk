import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../../types";
import * as queries from "../queries";
import { DomainsQueryDto, DomainDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "../../helpers";

const MAX_RECORDS = 5000;

export const getMostRecentDomains = async <T>(
  apolloClient: ApolloClient<T>,
  count = 100,
  skip = 0
): Promise<Domain[]> => {
  const domains: Domain[] = [];
  let queryResults: DomainDto[] = [];
  let yetUnreceived = count;

  if (count >= MAX_RECORDS) {
    throw new Error(
      `Please request no more than ${MAX_RECORDS} records at a time.`
    );
  }

  do {
    const queryResult = await performQuery<DomainsQueryDto>(
      apolloClient,
      queries.getPastNDomains,
      { count: yetUnreceived, startIndex: skip }
    );

    queryResults = queryResult.data.domains;
    for (const domain of queryResults) {
      domains.push(convertDomainDtoToDomain(domain));
    }

    skip += queryResults.length;
    yetUnreceived -= queryResults.length;
  } while (yetUnreceived > 0 && queryResults.length != 0);

  return domains;
};
