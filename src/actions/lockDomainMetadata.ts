import { ethers } from "ethers";
import { Registrar } from "../contracts/types";
import { validateUserOwnsDomain, validateStatus as validateDomainUnlocked } from "./helpers";

export const lockDomainMetadata = async (
  domainId: string,
  lockStatus: boolean,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const potentialOwner = await registrar.signer.getAddress();
  validateUserOwnsDomain(
    domainId,
    potentialOwner,
    registrar,
    "Must own domain to lock metadata"
  );
  validateDomainUnlocked(domainId, registrar, "Metadata is already locked");

  const tx = await registrar.lockDomainMetadata(domainId, lockStatus);
  return tx;
};
