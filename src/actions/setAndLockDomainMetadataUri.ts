import { ethers } from "ethers";
import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";

export const setAndLockDomainMetadataUri = async (
  domainId: string,
  metadataUri: string,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const potentialOwner = await registrar.signer.getAddress();
  const isLocked = true;
  const ownerMessage = "Must own domain to update metadata";
  const statusMessage = "Metadata must be unlocked to be modified"

  validateOwnerAndStatus(
    domainId,
    registrar,
    potentialOwner,
    isLocked,
    ownerMessage,
    statusMessage
  );
  const tx = await registrar.setAndLockDomainMetadata(domainId, metadataUri);
  return tx;
};
