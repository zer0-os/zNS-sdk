import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../types";
import * as queries from "../queries";
import { DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "./helpers";

export const getDomainsByOwner = async <T>(
  apolloClient: ApolloClient<T>,
  owner: string
): Promise<Domain[]> => {
  const queryResult = await performQuery<DomainsQueryDto>(
    apolloClient,
    queries.getDomainsByOwner,
    { owner: owner.toLowerCase() }
  );

  const queriedDomains = queryResult.data.domains;
  const domains: Domain[] = queriedDomains.map(convertDomainDtoToDomain);
  return domains;
};
