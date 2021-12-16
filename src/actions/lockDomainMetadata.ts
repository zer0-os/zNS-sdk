import { ethers } from "ethers";
import { Registrar } from "../contracts/types";
import { validateUserOwnsDomain, validateStatus } from "./helpers";

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
  // Will throw an error if the lock status from the registrar is the same as the given lock.
  // e.g. You cannot lock already locked domain metadata, and you cannot unlock already unlocked domain metadata.
  validateStatus(domainId, registrar, lockStatus, "Metadata lock is already set to given lock status");

  const tx = await registrar.lockDomainMetadata(domainId, lockStatus);
  return tx;
};
