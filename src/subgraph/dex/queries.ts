import { gql } from "@apollo/client/core";

export const getTokenByAddressUniswap = gql`
  query Tokens($tokenAddress: ID!) {
    tokens(where: { id: $tokenAddress }) {
      id
      symbol
      name
      decimals
      derivedETH
    }
  }
`

export const getTokenByAddressSushiswap = gql`
  query Tokens($tokenAddress: ID!) {
    tokens(where: { id: $tokenAddress }) {
    id
    name
    symbol
    decimals
    lastPriceUSD
  }
  }
`