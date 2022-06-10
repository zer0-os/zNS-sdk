import { ZNSHub } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";
import { ethers } from "ethers";
import { znsApiClient } from "../api";
import { DomainMetadata } from "..";
import { getRegistrarForDomain } from "../helpers";
import { getLogger } from "../utilities";

const logger = getLogger("actions:setDomainMetadata");

export const setDomainMetadata = async (
  domainId: string,
  metadata: DomainMetadata,
  client: znsApiClient,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  logger.trace(
    `Calling to set domain metadata for domain ${domainId}`
  );
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
