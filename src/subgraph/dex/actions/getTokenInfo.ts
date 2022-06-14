import { ApolloClient } from "@apollo/client/core";
import { Maybe, TokenInfo } from "../../../types";
import * as queries from "../queries";
import { TokenInfoDto } from "../types";
import { performQuery } from "../../helpers";
import { getLogger } from "../../../utilities";

const logger = getLogger().withTag("subgraph:dexClient:getTokenInfo");

export const getTokenInfo = async <T>(
  apolloClient: ApolloClient<T>,
  tokenAddress: string
): Promise<Maybe<TokenInfo>> => {
  const queryResult = await performQuery<TokenInfoDto>(
    apolloClient,
    queries.getTokenByAddress,
    { tokenAddress: tokenAddress.toLowerCase() }
  );

  if (queryResult.data.tokens.length === 0) {
    logger.trace(`No token found with address ${tokenAddress}`);
    return undefined;
  }

  const token = queryResult.data.tokens[0];
  const tokenInfo: TokenInfo = {
    id: token.id,
    name: token.name,
    symbol: token.symbol,
    derivedETH: token.derivedETH,
    decimals: token.decimals,
  };

  logger.trace(`Found token ${tokenInfo.symbol} at address ${tokenAddress}`)
  return tokenInfo;
};
