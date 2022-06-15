import { createDexClient } from "../subgraph";
import { Config, Maybe, TokenInfo, ConvertedTokenInfo } from "../types";
import { getLogger } from "../utilities";
import { getTokenPrice } from "./helpers";

const logger = getLogger("actions:getPaymentTokenInfo");

/**
 * Get a specific ERC20 token's info such as price, name, symbol, and number of decimals
 * @param paymentTokenAddress The address of the token
 * @param config The configuration object used in instantiating this SDK
 * @returns The token info, if found
 */
export const getPaymentTokenInfo = async (
  paymentTokenAddress: string,
  config: Config
): Promise<ConvertedTokenInfo> => {
  logger.trace(`Getting paymentToken info for ${paymentTokenAddress}`);

  let token: Maybe<TokenInfo>;

  // Check each given DEX protocol
  for (const uri of config.dexSubgraphUris) {
    const client = await createDexClient(uri);

    token = await client.getTokenInfo(paymentTokenAddress);
    if (token) {
      break;
    }
  }

  // If we checked all the DEX protocols and still didn't find a token, error
  if (!token) {
    throw Error(
      `Token with address ${paymentTokenAddress} could not be resolved`
    );
  }

  const tokenPriceUsd = await getTokenPrice(token.derivedETH);

  const returnedTokenInfo: ConvertedTokenInfo = {
    id: token.id,
    name: token.name,
    symbol: token.symbol,
    priceInUsd: tokenPriceUsd.toString(),
    decimals: token.decimals,
  };

  return returnedTokenInfo;
};
