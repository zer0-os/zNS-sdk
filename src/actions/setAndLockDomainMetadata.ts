import { ethers } from "ethers";
import { DomainMetadata } from "..";
import { ApiClient } from "../api";
import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";
import { validateOwnerAndStatus } from "./helpers";

export const setAndLockDomainMetadata = async (
  domainId: string,
  metadata: DomainMetadata,
  client: ApiClient,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  const isLocked = true;
  const signerAddress = await signer.getAddress();
  const registrar = await getRegistrarForDomain(hub, domainId);

  await validateOwnerAndStatus(domainId, registrar, signerAddress, isLocked);
  const metadataUri = await client.uploadMetadata(metadata);

  const tx = await registrar
    .connect(signer)
    .setAndLockDomainMetadata(domainId, metadataUri);
  return tx;
};
