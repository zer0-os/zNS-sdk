import { Maybe, TokenInfo, UniswapTokenInfo } from "../../types";
export { TokenInfo };
import { getLogger } from "../../utilities";

import * as queries from "./queries";

import * as actions from "./actions";
import { createApolloClient } from "../helpers";
import { DocumentNode, NormalizedCacheObject } from "@apollo/client";

const logger = getLogger("subgraph:dexClient");

export interface DexSubgraphClient {
  getTokenInfo<T extends TokenInfo>(
    paymentTokenAddress: string,
    query: DocumentNode
  ): Promise<Maybe<T>>;
}

export const createDexClient = (dexSubgraphUri: string): DexSubgraphClient => {
  const apolloClient = createApolloClient(dexSubgraphUri);
  const client = {
    getTokenInfo: async <T extends TokenInfo>(
      paymentTokenAddress: string,
      query: DocumentNode
    ): Promise<Maybe<T>> => {
      logger.debug(
        `Calling to get payment token info for token ${paymentTokenAddress} using subgraph at ${dexSubgraphUri}`
      );
      const options = {
        tokenAddress: paymentTokenAddress.toLowerCase(),
      };
      const token: Maybe<T> = await actions.getTokenInfo<
        NormalizedCacheObject,
        T
      >(apolloClient, paymentTokenAddress, query, options);
      return token;
    },
  };
  return client as DexSubgraphClient;
};
