import { Maybe, TokenInfo } from "../../types";
import { getLogger } from "../../utilities";

import * as actions from "./actions";
import { createApolloClient } from "../helpers";

const logger = getLogger("subgraph:dexClient");

export interface UniswapSubgraphClient {
  getTokenInfo(tokenId: string): Promise<Maybe<TokenInfo>>;
}

export const createUniswapClient = (
  dexSubgraphUri: string
): UniswapSubgraphClient => {
  const apolloClient = createApolloClient(dexSubgraphUri);

  const client: UniswapSubgraphClient = {
    getTokenInfo: async (paymentTokenId: string): Promise<Maybe<TokenInfo>> => {
      logger.debug(`Getting payment token info for token ${paymentTokenId}`);
      const tokenInfo = await actions.getTokenInfo(
        apolloClient,
        paymentTokenId
      );
      return tokenInfo;
    },
  };
  return client;
};
