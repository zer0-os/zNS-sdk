import { ethers } from "ethers";
import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";
import { validateOwnerAndStatus } from "./helpers";

import { getLogger } from "../utilities";

const logger = getLogger("actions:lockDomainMetadata");

// Call to set domain metadata lock status to `lockStatus`
// e.g. set to `true` to lock, and `false` to unlock
export const lockDomainMetadata = async (
  domainId: string,
  desiredLock: boolean,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  logger.trace(`Calling to lock metadata for domain ${domainId}`);

  const signerAddress = await signer.getAddress();
  const registrar = await getRegistrarForDomain(hub, domainId);

  // Will throw an error if the lock status from the registrar is the same as the given `setToLock`
  // e.g. You cannot lock already locked domain metadata, and you cannot unlock already unlocked domain metadata.
  await validateOwnerAndStatus(domainId, registrar, signerAddress, desiredLock);

  const tx = await registrar
    .connect(signer)
    .lockDomainMetadata(domainId, desiredLock);
  return tx;
};
