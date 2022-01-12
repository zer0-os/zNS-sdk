import { ethers } from "ethers";
import { DomainMetadata } from "..";
import { ApiClient } from "../api";
import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";

export const setAndLockDomainMetadata = async (
  domainId: string,
  metadata: DomainMetadata,
  client: ApiClient,
  signer: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const isLocked = true;
  const signerAddress = await signer.getAddress();

  await validateOwnerAndStatus(domainId, registrar, signerAddress, isLocked);
  const metadataUri = await client.uploadMetadata(metadata);

  const tx = await registrar
    .connect(signer)
    .setAndLockDomainMetadata(domainId, metadataUri);
  return tx;
};
