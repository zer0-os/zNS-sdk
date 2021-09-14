import {
  ApolloClient,
  ApolloQueryResult,
  DocumentNode,
  OperationVariables,
} from "@apollo/client/core";
import { Domain } from "../../types";
import { DomainDto } from "../types";

/**
 * Helper function to perform a query on an apollo client.
 * If an error occurs, an exception is thrown
 * @param apolloClient The apollo client
 * @param query The query to run
 * @param variables Variables for the query
 * @returns Query Result
 */
export const performQuery = async <T, TCacheShape = unknown>(
  apolloClient: ApolloClient<TCacheShape>,
  query: DocumentNode,
  variables?: OperationVariables
): Promise<ApolloQueryResult<T>> => {
  const queryResult = await apolloClient.query<T>({
    query,
    variables,
  });

  if (queryResult.error) {
    throw queryResult.error;
  }

  return queryResult;
};

/**
 * Converts a subgraph domain Dto to our Domain object
 * @param e The Domain Dto to convert
 * @returns Domain type
 */
export const convertDomainDtoToDomain = (e: DomainDto): Domain => {
  const domain: Domain = {
    id: e.id,
    name: e.name,
    parentId: e.parent.id,
    owner: e.owner.id,
    minter: e.minter.id,
    metadataUri: e.metadata,
  };

  return domain;
};
