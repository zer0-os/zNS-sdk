import { Maybe, TokenInfo } from "../../types";
import { getLogger } from "../../utilities";

import * as actions from "./actions";
import { createApolloClient } from "../helpers";

const logger = getLogger("subgraph:dexClient");

export interface DexSubgraphClient {
  getTokenInfo(tokenId: string): Promise<Maybe<TokenInfo>>;
}

export const createDexClient = (dexSubgraphUri: string): DexSubgraphClient => {
  const apolloClient = createApolloClient(dexSubgraphUri);

  const client: DexSubgraphClient = {
    getTokenInfo: async (paymentTokenId: string): Promise<Maybe<TokenInfo>> => {
      logger.debug(`Getting payment token info for token ${paymentTokenId}`)
      const tokenInfo = await actions.getTokenInfo(apolloClient, paymentTokenId);
      return tokenInfo;
    },
  }
  return client;
};
