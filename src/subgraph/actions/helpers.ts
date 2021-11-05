import {
  ApolloClient,
  ApolloQueryResult,
  DocumentNode,
  FetchResult,
  OperationVariables,
} from "@apollo/client/core";
import { ethers } from "ethers";
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
 * Helper function to perform a mutation on Apollo client.
 * If an error occurs an exception is thrown.
 * @param apolloClient The Apollo client
 * @param mutation The mutation to run
 * @param variables The variable for the mutation
 * @returns The updated data
 */
export const performMutation = async <T, TCacheShape = unknown>(
  apolloClient: ApolloClient<TCacheShape>,
  mutation: DocumentNode,
  variables: OperationVariables
): Promise<FetchResult<T>> => {

  const result: FetchResult<T> = await apolloClient.mutate<T>({
    mutation,
    variables
  });

  if(result.errors){
    throw result.errors;
  }

  return result;
}

/**
 * Converts a subgraph domain Dto to our Domain object
 * @param e The Domain Dto to convert
 * @returns Domain type
 */
export const convertDomainDtoToDomain = (e: DomainDto): Domain => {
  const domain: Domain = {
    id: e.id,
    name: e.name,
    parentId: e.parent?.id ?? ethers.constants.HashZero,
    owner: e.owner.id,
    minter: e.minter?.id ?? ethers.constants.AddressZero,
    metadataUri: e.metadata,
    isRoot: e.id === ethers.constants.HashZero,
  };

  return domain;
};
