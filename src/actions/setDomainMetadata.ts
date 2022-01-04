import { Registrar } from "../contracts/types";
import { validateStatus, validateUserOwnsDomain } from "./helpers";
import { ethers } from "ethers";
import { ApiClient } from "../api";
import { DomainMetadata } from "..";

export const setDomainMetadata = async (
  domainId: string,
  metadata: DomainMetadata,
  client: ApiClient,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const potentialOwner = await registrar.signer.getAddress();

  validateUserOwnsDomain(
    domainId,
    potentialOwner,
    registrar,
    "Must own domain to update metadata"
  );
  const isLocked = true;
  validateStatus(domainId, registrar, isLocked, "Metadata must be unlocked to be modified");

  const metadataUri = await client.uploadMetadata(metadata);

  const tx = await registrar.setDomainMetadataUri(domainId, metadataUri);
  return tx;
}
