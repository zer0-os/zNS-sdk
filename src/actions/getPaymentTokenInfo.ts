import CoinGecko from "coingecko-api";
import { domains } from "..";
import { Config, TokenPriceInfo } from "../types";

export const getPaymentTokenInfo = async (
  paymentTokenAddress: string,
  config: Config
): Promise<TokenPriceInfo> => {
  const network = await config.provider.getNetwork();

  const addresses = domains.tokenAddressToFriendlyName[network.name]
  if (!addresses) {
    throw Error("Network not supported")
  }
  
  const tokenInfo = addresses[paymentTokenAddress]
  if (!tokenInfo) {
    throw Error("Token not found")
  }

  const client = new CoinGecko();
  const tokenData = await client.coins.fetch(tokenInfo.id, {
    market_data: true,
  });

  if(!tokenData) {
    throw Error("Can't find information about that token")
  }

  const tokenPriceUsd = tokenData.data.market_data.current_price.usd;

  return {
    price: tokenPriceUsd,
    name: tokenInfo.name
  } as TokenPriceInfo
};
