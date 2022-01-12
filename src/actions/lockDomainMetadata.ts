import { ethers } from "ethers";
import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";

// Call to set domain metadata lock status to `lockStatus`
// e.g. set to `true` to lock, and `false` to unlock
export const lockDomainMetadata = async (
  domainId: string,
  desiredLock: boolean,
  signer: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const signerAddress = await signer.getAddress();

  // Will throw an error if the lock status from the registrar is the same as the given `setToLock`
  // e.g. You cannot lock already locked domain metadata, and you cannot unlock already unlocked domain metadata.
  validateOwnerAndStatus(domainId, registrar, signerAddress, desiredLock);
  // const lockedState = await registrar.isDomainMetadataLocked(domainId);

  const tx = await registrar
    .connect(signer)
    .lockDomainMetadata(domainId, desiredLock);
  return tx;
};
