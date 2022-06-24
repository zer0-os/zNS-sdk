import { ApolloClient, DocumentNode } from "@apollo/client/core";
import { Maybe, TokenInfo } from "../../../types";
import * as queries from "../queries";
import { UniswapTokenDto, QueryOptions, TokenCollectionBase, TokenDto } from "../types";
import { performQuery } from "../../helpers";
import { getLogger } from "../../../utilities";

const logger = getLogger().withTag("subgraph:dexClient:getTokenInfo");

export const getTokenInfo = async <TCacheShape, T extends TokenDto>(
  apolloClient: ApolloClient<TCacheShape>,
  tokenAddress: string,
  query: DocumentNode,
  options: QueryOptions
): Promise<Maybe<T>> => {
  const queryResult = await performQuery<TokenCollectionBase<T>>(
    apolloClient,
    query,
    options
  );

  if (queryResult.data.tokens.length === 0) {
    logger.trace(`No token found with address ${tokenAddress}`);
    return undefined;
  }

  const token = queryResult.data.tokens[0];

  logger.trace(`Found token ${token.symbol} at address ${tokenAddress}`)
  return token;
};
