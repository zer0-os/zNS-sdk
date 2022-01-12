import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";
import { ethers } from "ethers";
import { ApiClient } from "../api";
import { DomainMetadata } from "..";

export const setDomainMetadata = async (
  domainId: string,
  metadata: DomainMetadata,
  client: ApiClient,
  signer: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const isLocked = true;
  const signerAddress = await signer.getAddress();

  validateOwnerAndStatus(domainId, registrar, signerAddress, isLocked);

  const metadataUri = await client.uploadMetadata(metadata);
  const tx = await registrar
    .connect(signer)
    .setDomainMetadataUri(domainId, metadataUri);
  return tx;
};
