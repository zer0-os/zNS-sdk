import { createUniswapClient } from "../../subgraph";
import { TokenDto } from "../../subgraph/dex/types";
import { Config, Maybe, TokenInfo } from "../../types";
import { getLogger } from "../../utilities";
import { getTokenPrice } from "../helpers";

const logger = getLogger("actions:zauction:getPaymentTokenInfo");

/**
 * Get a specific ERC20 token's info such as price, name, symbol, and number of decimals
 * @param paymentTokenAddress The address of the token
 * @param config The configuration object used in instantiating this SDK
 * @returns The token info, if found
 */
export const getPaymentTokenInfo = async (
  paymentTokenAddress: string,
  config: Config
): Promise<TokenInfo> => {
  logger.trace(`Getting paymentToken info for ${paymentTokenAddress}`);

  // Check Uniswap DEX protocol
  const client = await createUniswapClient(config.uniswapSubgraphUri);

  const token: Maybe<TokenDto> = await client.getTokenInfo(paymentTokenAddress);

  if (!token) {
    throw Error(
      `Token pricing info with address ${paymentTokenAddress} could not be found`
    );
  }

  const tokenPriceUsd = await getTokenPrice(
    paymentTokenAddress,
    token.derivedETH
  );

  const returnedTokenInfo: TokenInfo = {
    id: token.id,
    name: token.name,
    symbol: token.symbol,
    priceInUsd: tokenPriceUsd.toString(),
    decimals: token.decimals,
  };

  return returnedTokenInfo;
};
