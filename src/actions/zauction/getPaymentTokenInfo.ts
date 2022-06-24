import { createDexClient, DexSubgraphClient } from "../../subgraph";
import { queries } from "../../subgraph/dex/queries";
import {
  Config,
  Maybe,
  ConvertedTokenInfo,
  UniswapTokenInfo,
  SushiswapTokenInfo,
  DexProtocolsToCheck,
} from "../../types";
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
): Promise<ConvertedTokenInfo> => {
  logger.trace(`Getting paymentToken info for ${paymentTokenAddress}`);

  let client: DexSubgraphClient;

  // Check each configured DEX protocol
  for (const dex of Object.values(DexProtocolsToCheck)) {
    const query = queries.get(dex);

    if (!query) {
      throw Error(`No configured query for DEX Protocol Subgraph: ${dex}`);
    }

    client = await createDexClient(config.dexSubgraphUris[dex]);

    const token: Maybe<UniswapTokenInfo | SushiswapTokenInfo> =
      await client.getTokenInfo(paymentTokenAddress, query);

    if (token) {
      const tokenPriceUsd = await getTokenPrice(
        dex,
        paymentTokenAddress,
        token
      );
      const tokenInfo: ConvertedTokenInfo = {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        priceInUsd: tokenPriceUsd,
        decimals: token.decimals,
      };

      logger.trace(
        `Found token ${tokenInfo.name}, $${token.symbol} at given address`
      );

      return tokenInfo;
    }
  }

  // If not found on any DEX, we return an error;
  throw Error(
    `Token info with address ${paymentTokenAddress} could not be found`
  );
};
