import * as ethers from "ethers";
import { Registrar } from "../contracts/types";
import { validateUserOwnsDomain } from "./helpers";

export const setDomainRoyalty = async (
  domainId: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const signerAddress = await signer.getAddress();

  validateUserOwnsDomain(domainId, signerAddress, registrar);

  const tx = await registrar.setDomainRoyaltyAmount(domainId, amount);
  return tx;
};
