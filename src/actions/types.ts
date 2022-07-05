import { Map } from "../types";
export interface CoinGeckoPrice {
  usd: number;
}

export type CoinGeckoResponse = Map<CoinGeckoPrice>;

export interface CoinGeckoRequestOptions {
  ids?: string;
  vs_currencies: string;
}
