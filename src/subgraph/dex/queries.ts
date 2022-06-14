import { gql } from "@apollo/client/core";

export const getTokenByAddress = gql`
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