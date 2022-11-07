import { getLogger } from "../utilities";
import { ethers } from "ethers";
import { DomainPurchaser } from "../contracts/types/DomainPurchaser";

const logger = getLogger("actions:getDomainMetadata");

export const getPriceOfNetworkDomain = async (
  name: string,
  domainPurchaser: DomainPurchaser
): Promise<string> => {
  logger.trace(`Get price of network domain for: ${name}`);

  // Max length of a domain is 32 characters
  if (!name || name.length > 32) {
    logger.trace(`Domain name '${name} is beyond the maximum name length.`);
    return "-1.0";
  }
  const price = await domainPurchaser.getDomainPrice(0, name);
  const formattedPrice = ethers.utils.formatEther(price);
  return formattedPrice;
};
