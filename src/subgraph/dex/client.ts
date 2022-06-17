import { Maybe, TokenInfo, UniswapTokenInfo } from "../../types";
import { getLogger } from "../../utilities";

import * as queries from "./queries";

import * as actions from "./actions";
import { createApolloClient } from "../helpers";
import { TokenDto } from "./types";
import { UniswapTokenDto } from "./types";
import { NormalizedCacheObject } from "@apollo/client";

const logger = getLogger("subgraph:dexClient");

export interface UniswapSubgraphClient {
  getTokenInfo(tokenId: string): Promise<Maybe<TokenDto>>;
  getTokenInfo(tokenId: string): Promise<Maybe<UniswapTokenInfo>>;
}

export const createUniswapClient = (
  dexSubgraphUri: string
): UniswapSubgraphClient => {
  const apolloClient = createApolloClient(dexSubgraphUri);

  const client: UniswapSubgraphClient = {
    getTokenInfo: async (
      paymentTokenId: string
    ): Promise<Maybe<UniswapTokenInfo>> => {
      logger.debug(
        `Calling to get payment token info for token ${paymentTokenId} on Uniswap`
      );
      const options = {
        tokenAddress: paymentTokenId.toLowerCase(),
      };
      const token = await actions.getTokenInfo<
        NormalizedCacheObject,
        UniswapTokenDto
      >(
        apolloClient,
        paymentTokenId,
        queries.getTokenByAddressUniswap,
        options
      );
      if (!token) {
        return undefined;
      }
      const tokenInfo: UniswapTokenInfo = {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        derivedETH: token.derivedETH,
        decimals: token.decimals,
      };
      return tokenInfo;
    },
  };
  return client;
};

// export const createSushiswapClient = (
//   dexSubgraphUri: string
// ): UniswapSubgraphClient => {
//   const apolloClient = createApolloClient(dexSubgraphUri);

//   const client: UniswapSubgraphClient = {
//     getTokenInfo: async (paymentTokenId: string): Promise<Maybe<TokenInfo>> => {
//       logger.debug(
//         `Calling to get payment token info for token ${paymentTokenId} on Sushiswap`
//       );
//       const options = {
//         tokenAddress: paymentTokenId.toLowerCase(),
//       };
//       const token = await actions.getTokenInfo(
//         apolloClient,
//         paymentTokenId,
//         queries.getTokenByAddressUniswap,
//         options
//       );
//       // Check the next DEX if not found
//       if (!token) {
//         return undefined;
//       }
//       // const tokenInfo = {
//       //   id: token.id,
//       //   name: token.name,
//       //   symbol: token.symbol,
//       //   decimals: token.decimals,
//       // };
//       // return token;
//     },
//   };
//   return client;
// };
