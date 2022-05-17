import { ethers } from "ethers";
import { Config } from "../types";
import { getHubContract } from "../contracts";
import { Instance } from "@zero-tech/zauction-sdk";


export const setPaymentTokenForDomain = async (
  networkId: string,
  paymentTokenAddress: string,
  signer: ethers.Signer,
  config: Config,
  zAuctionInstance: Instance
): Promise<ethers.ContractTransaction> => {
  const hub = await getHubContract(config.provider, config.hub);

  const parent = await hub.parentOf(networkId);

  if (!parent.eq(ethers.constants.HashZero)) {
    throw Error("Can only set network payment tokens on network domains");
  }

  const tx = await zAuctionInstance.setNetworkPaymentToken(
    networkId,
    paymentTokenAddress,
    signer
  );
  return tx;
};
