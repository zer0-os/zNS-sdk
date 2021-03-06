import { ethers } from "ethers";
import { DomainMetadata } from "..";
import { znsApiClient } from "../api";
import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";
import { validateOwnerAndStatus } from "./helpers";
import { getLogger } from "../utilities";

const logger = getLogger("actions:setAndLockDomainMetadata");

export const setAndLockDomainMetadata = async (
  domainId: string,
  metadata: DomainMetadata,
  client: znsApiClient,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  logger.trace(
    `Calling to set and lock domain metadata for domain ${domainId}`
  );
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
