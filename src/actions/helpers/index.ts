import { makeApiCall } from "../../api/helpers";
import { Registrar } from "../../contracts/types";
import { getLogger } from "../../utilities";
import {
  ETHEREUM_ID,
  ETHEREUM_PRICE_ENDPOINT,
  ERC20_PRICE_ENDPOINT,
} from "./constants";
import { CoinGeckoRequestOptions, CoinGeckoResponse } from "../types";
import {
  DexProtocolsToCheck,
  SushiswapTokenInfo,
  UniswapTokenInfo,
} from "../../types";

const logger = getLogger("actions:helpers");

const createCoinGeckoUri = (tokenAddress?: string): string => {
  if (tokenAddress) {
    const options: CoinGeckoRequestOptions = {
      ids: tokenAddress,
      vs_currencies: "usd",
    };
    return `${ERC20_PRICE_ENDPOINT}contract_addresses=${options.ids}&vs_currencies=${options.vs_currencies}`;
  }

  return ETHEREUM_PRICE_ENDPOINT;
};

export const validateUserOwnsDomain = async (
  domainId: string,
  potentialOwner: string,
  registrar: Registrar
): Promise<void> => {
  const owner = await registrar.ownerOf(domainId);
  if (potentialOwner !== owner) throw Error("Must own domain to modify");
};

export const validateStatus = async (
  domainId: string,
  registrar: Registrar,
  desiredLock: boolean,
  potentialOwner: string
): Promise<void> => {
  const isCurrentlyLocked = await registrar.isDomainMetadataLocked(domainId);
  if (isCurrentlyLocked === desiredLock)
    throw Error("Metadata must be unlocked to be modified");
  if (isCurrentlyLocked) {
    const currentLocker = await registrar.domainMetadataLockedBy(domainId);
    if (currentLocker.toLowerCase() != potentialOwner.toLowerCase()) {
      throw Error(`Only the account that locked the metadata can unlock.`);
    }
  }
};

export const validateOwnerAndStatus = async (
  domainId: string,
  registrar: Registrar,
  potentialOwner: string,
  desiredLock: boolean
): Promise<void> => {
  logger.trace(
    `Validate the potential owner ${potentialOwner} of domain ${domainId} and set lock status to ${desiredLock}`
  );
  await validateUserOwnsDomain(domainId, potentialOwner, registrar);
  await validateStatus(domainId, registrar, desiredLock, potentialOwner);
};

/**
 * Try to resolve the price information by checking which
 * DEX protocol it was found on and then getting that information
 * @param dex The DEX protocol used
 * @param paymentTokenAddress The hex address of the ERC20 token
 * @param tokenInfo The tokenInfo object
 * @returns The price of the token
 */
export const getTokenPrice = async (
  dex: DexProtocolsToCheck,
  paymentTokenAddress: string,
  tokenInfo: UniswapTokenInfo | SushiswapTokenInfo
): Promise<string> => {
  let tokenPriceUsd: string;
  if (dex === DexProtocolsToCheck.Uniswap) {
    tokenPriceUsd = await getUniswapTokenPrice(
      paymentTokenAddress,
      (tokenInfo as UniswapTokenInfo).derivedETH
    );
  } else {
    tokenPriceUsd = (tokenInfo as SushiswapTokenInfo).lastPriceUSD;
  }

  return tokenPriceUsd;
};

/**
 * Try to find price information using a token found on Uniswap
 * If not found on Coin Gecko, the derivedETH value is used to
 * calculate the price instead
 * @param paymentTokenAddress The contract address of the ERC20 payment token
 * @param derivedETH The derived ETH ratio
 * @returns The price of the token
 */
const getUniswapTokenPrice = async (
  paymentTokenAddress: string,
  derivedETH: string
): Promise<string> => {
  let uri = createCoinGeckoUri(paymentTokenAddress);
  let response = await makeApiCall<CoinGeckoResponse>(uri, "GET");

  if (Object.keys(response).length > 0) {
    const priceAsString = String(
      response[paymentTokenAddress.toLowerCase()].usd
    );
    return priceAsString;
  }

  // If the price isn't found directly on CoinGecko we instead compare
  // with the price of ETH using the derived ETH ratio
  uri = createCoinGeckoUri();
  response = await makeApiCall<CoinGeckoResponse>(uri, "GET");

  const ethPriceUsd = response[ETHEREUM_ID].usd;
  const derivedETHAsFloat = parseFloat(derivedETH);
  return String(derivedETHAsFloat * ethPriceUsd);
};
