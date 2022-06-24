import { DocumentNode, gql } from "@apollo/client/core";

const internalQueries = {
  Uniswap: gql`
    query Tokens($tokenAddress: ID!) {
      tokens(where: { id: $tokenAddress }) {
        id
        symbol
        name
        decimals
        derivedETH
      }
    }
  `,
  Sushiswap: gql`
    query Tokens($tokenAddress: ID!) {
      tokens(where: { id: $tokenAddress }) {
        id
        name
        symbol
        decimals
        lastPriceUSD
      }
    }
  `,
};

export const queries = new Map<string, DocumentNode>(
  Object.entries(internalQueries)
);
