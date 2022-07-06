import { Map } from "../../types";
export interface TokenDto {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
}

export interface UniswapTokenDto extends TokenDto {
  derivedETH: string;
}

export interface SushiswapTokenDto extends TokenDto {
  lastPriceUSD: string;
}

export interface TokenCollectionBase<T> {
  tokens: T[];
}

export type QueryOptions = Map<string>;
