import { makeApiCall } from "../../api/helpers";
import { Registrar } from "../../contracts/types";
import { getLogger } from "../../utilities";
import {
  ETHEREUM_API_ID,
  ETHEREUM_PRICE_ENDPOINT,
  ERC20_PRICE_ENDPOINT,
} from "./constants";
import { 
  CoinGeckoRequestOptions,
  CoinGeckoResponse,
  CoinGeckoPrice
} from "../../types";

const logger = getLogger("actions:helpers");

const createUri = (tokenAddress?: string): string => {
  const options: CoinGeckoRequestOptions = {
    ids: tokenAddress ?? "ethereum",
    vs_currencies: "usd",
  };

  if (tokenAddress) {
    return `${ERC20_PRICE_ENDPOINT}contract_addresses=${options.ids}&vs_currencies=${options.vs_currencies}`;
  }

  return `${ETHEREUM_PRICE_ENDPOINT}ids=${options.ids}&vs_currencies=${options.vs_currencies}`;
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
 * If it can't be found on CoinGecko, that token's derived ETH ratio
 * given by a DEX subgraph is used instead
 * @param paymentTokenAddress The contract address of the ERC20 payment token
 * @param derivedETH The derived ETH ratio
 * @returns The price of the token in USD
 */
export const getTokenPrice = async (
  paymentTokenAddress: string,
  derivedETH: string
): Promise<number> => {
  let uri = createUri(paymentTokenAddress);
  let response = await makeApiCall<CoinGeckoResponse>(uri, "GET");

  if (Object.keys(response).length > 0) {
    return response[paymentTokenAddress.toLowerCase()].usd
  }

  // If the price isn't found directly on CoinGecko we instead compare
  // with the price of ETH using the derived ETH ratio
  uri = createUri();
  response = await makeApiCall<CoinGeckoResponse>(uri, "GET");

  const ethPriceUsd = response[ETHEREUM_API_ID].usd;
  const derivedETHAsFloat = parseFloat(derivedETH);
  return derivedETHAsFloat * ethPriceUsd;
};
