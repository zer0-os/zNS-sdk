import { getLogger } from "../utilities";
import { ethers } from "ethers";
import { ZNSHub } from "../contracts/types";

const logger = getLogger("actions:getDomainMetadata");

export const isNetworkDomainAvailable = async (
  name: string,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<boolean> => {
    logger.trace(`Get price of network domain for: ${name}`);
    // const tx = await hub
    //   .connect(signer)
    //   .getDomainPrice(0, name);
    // const price = ethers.utils.formatEther(tx);
    // Naughty Check
    return true;
};
