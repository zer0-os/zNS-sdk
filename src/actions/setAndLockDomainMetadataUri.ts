import { ethers } from "ethers";
import { Registrar } from "../contracts/types";
import { validateUserOwnsDomain, validateStatus } from "./helpers";

export const setAndLockDomainMetadataUri = async (
  domainId: string,
  metadataUri: string,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const potentialOwner = await registrar.signer.getAddress();
  validateUserOwnsDomain(
    domainId,
    potentialOwner,
    registrar,
    "Must own domain to lock metadata"
  );
  // For set and lock, we always will be locking
  validateStatus(domainId, registrar, true, "Metadata must be unlocked to be modified");

  // Always will call with lockStatus: true, so can ignore
  const tx = await registrar.setAndLockDomainMetadata(domainId, metadataUri);
  return tx;
};
