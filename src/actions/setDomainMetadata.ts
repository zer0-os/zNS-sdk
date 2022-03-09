import { Registrar, ZNSHub } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";
import { ethers } from "ethers";
import { ApiClient } from "../api";
import { DomainMetadata } from "..";
import { getRegistrarForDomain } from "../helpers";

export const setDomainMetadata = async (
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
    .setDomainMetadataUri(domainId, metadataUri);
  return tx;
};
