import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../types";
import * as queries from "../queries";
import { DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "./helpers";

export const getSubdomainsById = async <T>(
  apolloClient: ApolloClient<T>,
  domainId: string
): Promise<Domain[]> => {
  const queryResult = await performQuery<DomainsQueryDto>(
    apolloClient,
    queries.getSubdomainsById,
    { parent: domainId }
  );

  const queriedDomains = queryResult.data.domains;
  const domains: Domain[] = queriedDomains.map(convertDomainDtoToDomain);
  return domains;
};
