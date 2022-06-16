export interface CoinGeckoPrice {
  usd: number;
}

export interface CoinGeckoResponse {
  [tokenId: string]: CoinGeckoPrice;
}

export interface CoinGeckoRequestOptions {
  ids?: string;
  vs_currencies: string;
}
