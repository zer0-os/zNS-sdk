import * as ethers from "ethers";
import { Registrar } from "../contracts/types";
import { validateUserOwnsDomain } from "./helpers";

export const setDomainRoyalty = async (
  domainId: string,
  amount: ethers.BigNumber,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const potentialOwner = await registrar.signer.getAddress();
  validateUserOwnsDomain(
    domainId,
    potentialOwner,
    registrar,
    "Can only change the royalty on a domain you own"
  );

  const tx = await registrar.setDomainRoyaltyAmount(domainId, amount);
  return tx;
};
