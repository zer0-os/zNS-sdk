import { Map } from "../types"
export interface CoinGeckoPrice {
  usd: number;
}

export interface CoinGeckoResponse extends Map<CoinGeckoPrice>{}

export interface CoinGeckoRequestOptions {
  ids?: string;
  vs_currencies: string;
}
