import { ApolloClient } from "@apollo/client/core";
import { Domain } from "../../types";
import * as queries from "../queries";
import { DomainQueryDto } from "../types";
import { convertDomainDtoToDomain, performQuery } from "./helpers";

export const getDomainById = async <T>(
  apolloClient: ApolloClient<T>,
  domainId: string
) => {
  const queryResult = await performQuery<DomainQueryDto>(
    apolloClient,
    queries.getDomainById,
    { id: domainId }
  );

  const queriedDomain = queryResult.data.domain;
  const domain: Domain = convertDomainDtoToDomain(queriedDomain);
  return domain;
};
