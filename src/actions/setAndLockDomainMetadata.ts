import { ethers } from "ethers";
import { DomainMetadata } from "..";
import { ApiClient } from "../api";
import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";

export const setAndLockDomainMetadata = async (
  domainId: string,
  metadata: DomainMetadata,
  client: ApiClient,
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
  const metadataUri = await client.uploadMetadata(metadata);

  const tx = await registrar.setAndLockDomainMetadata(domainId, metadataUri);
  return tx;
};
