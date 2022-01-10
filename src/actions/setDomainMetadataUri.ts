import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";
import { ethers } from "ethers";

export const setDomainMetadataUri = async (
  domainId: string,
  metadataUri: string,
  potentialOwner: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const isLocked = true;
  const ownerMessage = "Must own domain to update metadata";
  const statusMessage = "Metadata must be unlocked to be modified";
  const potentialOwnerAddress = await potentialOwner.getAddress();

  validateOwnerAndStatus(
    domainId,
    registrar,
    potentialOwnerAddress,
    isLocked,
    ownerMessage,
    statusMessage
  )

  const tx = await registrar.setDomainMetadataUri(domainId, metadataUri);
  return tx;
}
