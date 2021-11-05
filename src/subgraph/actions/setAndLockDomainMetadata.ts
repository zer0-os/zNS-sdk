import { ApolloClient, FetchResult, MutationOptions } from "@apollo/client"
import { performMutation } from "./helpers"
import * as queries from "../queries";
import { Domain } from "../../types";

export const setAndLockDomainMetadata = async <T> (
  apolloClient: ApolloClient<T>,
  domainId: string,
  domainUri: string,
  toLock: boolean
): Promise<Domain> => {
  const mutationData = {
    id: domainId,
    uri: domainUri,
    lockock: toLock
  };
  const fetchResult: FetchResult<Domain> = await performMutation<Domain>(apolloClient, queries.setAndLockDomainMetadata, mutationData);

  // Expect to have the updated data
  if (!fetchResult) throw Error;

  return fetchResult.data as Domain;
}


