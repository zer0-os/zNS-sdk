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
export interface UniswapTokenCollection extends TokenCollectionBase<UniswapTokenCollection> {};
export interface SushiswapTokenCollection extends TokenCollectionBase<SushiswapTokenDto> {};
export interface TokenCollectionBase<T> {
  tokens: T[];
}



export interface QueryOptions extends Map<string> {}
