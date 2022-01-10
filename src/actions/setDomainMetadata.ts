import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";
import { ethers } from "ethers";
import { ApiClient } from "../api";
import { DomainMetadata } from "..";

export const setDomainMetadata = async (
  domainId: string,
  metadata: DomainMetadata,
  client: ApiClient,
  potentialOwner: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const isLocked = true;
  const ownerMessage = "Must own domain to update metadata";
  const statusMessage = "Metadata must be unlocked to be modified"
  const potentialOwnerAddress = await potentialOwner.getAddress();

  validateOwnerAndStatus(
    domainId,
    registrar,
    potentialOwnerAddress,
    isLocked,
    ownerMessage,
    statusMessage
  );

  const metadataUri = await client.uploadMetadata(metadata);
  const tx = await registrar.connect(potentialOwner)
    .setDomainMetadataUri(domainId, metadataUri);
  return tx;
}
