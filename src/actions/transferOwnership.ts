import { ethers } from "ethers";
import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";

import { getLogger } from "../utilities";

const logger = getLogger("actions:transferOwnership");

export const transferOwnership = async (
  to: string,
  domainId: string,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  logger.trace(
    `Calling to transfer ownership of domain ${domainId} to user ${to}`
  );
  const signerAddress = await signer.getAddress();
  const registrar = await getRegistrarForDomain(hub, domainId);
  const currentOwner = await registrar.ownerOf(domainId);

  if (signerAddress !== currentOwner) {
    throw new Error(`Signer ${signerAddress} is not the owner of ${domainId}`);
  }

  const connectedRegistrar = registrar.connect(signer);
  const tx = await connectedRegistrar[
    "safeTransferFrom(address,address,uint256)"
  ](signerAddress, to, domainId);
  return tx;
};
