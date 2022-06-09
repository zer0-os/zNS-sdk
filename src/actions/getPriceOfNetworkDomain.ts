import { getLogger } from "../utilities";
import { ethers } from "ethers";
import { DomainPurchaser } from "../contracts/types/DomainPurchaser";

const logger = getLogger("actions:getDomainMetadata");

export const getPriceOfNetworkDomain = async (
  name: string,
  domainPurchaser: DomainPurchaser
): Promise<string> => {
    logger.trace(`Get price of network domain for: ${name}`);
    const tx = await domainPurchaser
      .getDomainPrice(0, name);
    const price = ethers.utils.formatEther(tx);
    return price;
};
