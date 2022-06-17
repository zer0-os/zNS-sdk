import { makeApiCall } from "../../api/helpers";
import { Registrar } from "../../contracts/types";
import { getLogger } from "../../utilities";
import {
  ETHEREUM_API_ID,
  ETHEREUM_PRICE_ENDPOINT,
  ERC20_PRICE_ENDPOINT,
} from "./constants";
import { CoinGeckoRequestOptions, CoinGeckoResponse } from "../types";

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
) => {
  const owner = await registrar.ownerOf(domainId);
  if (potentialOwner !== owner) throw Error("Must own domain to modify");
};

export const validateStatus = async (
  domainId: string,
  registrar: Registrar,
  desiredLock: boolean,
  potentialOwner: string
) => {
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
) => {
  logger.trace(
    `Validate the potential owner ${potentialOwner} of domain ${domainId} and set lock status to ${desiredLock}`
  );
  await validateUserOwnsDomain(domainId, potentialOwner, registrar);
  await validateStatus(domainId, registrar, desiredLock, potentialOwner);
};

/**
 * Get a token's price using the CoinGecko API.
 * If it can't be found on CoinGecko, then we use the derivedEth
 * provided by the Uniswap subgraph
 * @param paymentTokenAddress The contract address of the ERC20 payment token
 * @param derivedETH The derived ETH ratio
 * @returns The price of the token in USD
 */
export const getTokenPrice = async (
  paymentTokenAddress: string,
  derivedETH?: string
): Promise<number> => {
  const price = await getTokenPriceFromCoinGecko(paymentTokenAddress, derivedETH);
  return price;
};

const getTokenPriceFromCoinGecko = async (paymentTokenAddress: string, derivedETH?: string): Promise<number> => {
  let uri = createCoinGeckoUri(paymentTokenAddress);
  let response = await makeApiCall<CoinGeckoResponse>(uri, "GET");

  if (Object.keys(response).length > 0) {
    return response[paymentTokenAddress.toLowerCase()].usd;
  }

  if (!derivedETH) {
    throw Error(
      `Unable to determine the price for token with address ${paymentTokenAddress}`
    );
  }

  // If the price isn't found directly on CoinGecko we instead compare
  // with the price of ETH using the derived ETH ratio
  uri = createCoinGeckoUri();
  response = await makeApiCall<CoinGeckoResponse>(uri, "GET");

  const ethPriceUsd = response[ETHEREUM_API_ID].usd;
  const derivedETHAsFloat = parseFloat(derivedETH);
  return derivedETHAsFloat * ethPriceUsd;
}
