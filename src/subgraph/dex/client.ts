import { Maybe, TokenInfo } from "../../types";
import { getLogger } from "../../utilities";

import * as actions from "./actions";
import { createApolloClient } from "../helpers";
import { TokenDto } from "./types";

const logger = getLogger("subgraph:dexClient");

export interface UniswapSubgraphClient {
  getTokenInfo(tokenId: string): Promise<Maybe<TokenDto>>;
}

export const createUniswapClient = (
  dexSubgraphUri: string
): UniswapSubgraphClient => {
  const apolloClient = createApolloClient(dexSubgraphUri);

  const client: UniswapSubgraphClient = {
    getTokenInfo: async (paymentTokenId: string): Promise<Maybe<TokenDto>> => {
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
