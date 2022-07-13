import * as apollo from "@apollo/client/core";
import fetch from "cross-fetch";

export const createApolloClient = (
  subgraphUri: string
): apollo.ApolloClient<apollo.NormalizedCacheObject> => {
  const client = new apollo.ApolloClient({
    link: new apollo.HttpLink({ uri: subgraphUri, fetch }),
    cache: new apollo.InMemoryCache(),
  });

  return client;
};

import {
  ApolloClient,
  ApolloQueryResult,
  DocumentNode,
  OperationVariables,
} from "@apollo/client/core";
import { ethers } from "ethers";
import { Domain } from "../../types";
import { DomainDto } from "../zns/types";

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
    id: e.id.toLowerCase(),
    name: e.name,
    parentId: e.parent?.id.toLowerCase() ?? ethers.constants.HashZero,
    owner: e.owner.id.toLowerCase(),
    minter: e.minter?.id.toLowerCase() ?? ethers.constants.AddressZero,
    metadataUri: e.metadata,
    isRoot: e.id === ethers.constants.HashZero,
    lockedBy: e.lockedBy?.id.toLowerCase() ?? ethers.constants.AddressZero,
    isLocked: e.isLocked,
    contract: e.contract?.id.toLowerCase() ?? ethers.constants.AddressZero,
    metadataName: e.metadataName,
  };

  return domain;
};
