import CoinGecko from "coingecko-api";
import { Config, TokenPriceInfo } from "../types";
import { Maybe } from "../utilities";

interface NetworksToPaymentTokens {
  [network: string]: Maybe<PaymentTokensToTokenApiInfo>;
}

interface PaymentTokensToTokenApiInfo {
  [address: string]: Maybe<TokenApiInfo>
}

interface TokenApiInfo {
  id: string,
  name:string
}

// ID must be the given ID from CoinGecko API.
// You can get this value from a token's page under "API ID"
// https://www.coingecko.com/en/coins/zero-tech
const tokenAddressToFriendlyName: NetworksToPaymentTokens = {
  mainnet: {
    "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34": {
      id: "wilder-world",
      name: "WILD"
    } as TokenApiInfo,
    "0x0ec78ed49c2d27b315d462d43b5bab94d2c79bf8": {
      id: "zero-tech",
      name: "ZERO"
    } as TokenApiInfo
  } as PaymentTokensToTokenApiInfo,
  rinkeby: {
    "0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79": {
      id: "wilder-world",
      name: "WILD"
    } as TokenApiInfo,
    "0x5bAbCA2Af93A9887C86161083b8A90160DA068f2": {
      id: "zero-tech",
      name: "ZERO"
    } as TokenApiInfo
  } as PaymentTokensToTokenApiInfo
}

export const getPaymentTokenInfo = async (
  paymentTokenAddress: string,
  config: Config
): Promise<TokenPriceInfo> => {
  const network = await config.provider.getNetwork();

  const addresses = tokenAddressToFriendlyName[network.name]
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
  const info: TokenPriceInfo = {
    price: tokenPriceUsd,
    name: tokenInfo.name
  }
  return info;
};
