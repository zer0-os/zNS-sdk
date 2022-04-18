import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../types";
import * as queries from "../queries";
import { DomainsQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "./helpers";

export const getDomainsByName = async <T>(
  apolloClient: ApolloClient<T>,
  name: string
): Promise<Domain[]> => {
  const zNANameQueryResult = await performQuery<DomainsQueryDto>(
    apolloClient,
    queries.getDomainsByName,
    { name }
  );

  const metadataNameQueryResult = await performQuery<DomainsQueryDto>(
    apolloClient,
    queries.getDomainsByMetadataName,
    { name }
  );

  const znaDomains: Domain[] = zNANameQueryResult.data.domains.map(
    convertDomainDtoToDomain
  );
  const metadataNameDomains: Domain[] =
    metadataNameQueryResult.data.domains.map(convertDomainDtoToDomain);

  let domains = znaDomains.concat(metadataNameDomains);
  // Remove duplicates based on `domain.id`
  domains = domains.filter(
    (domain, index) => domains.findIndex((e) => e.id === domain.id) === index
  );

  return domains;
};
