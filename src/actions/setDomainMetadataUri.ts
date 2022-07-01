import { Registrar, ZNSHub } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";
import { ethers } from "ethers";
import { getRegistrarForDomain } from "../helpers";
import { getLogger } from "../utilities";

const logger = getLogger("actions:setDomainMetadataUri");

export const setDomainMetadataUri = async (
  domainId: string,
  metadataUri: string,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  logger.trace(`Calling to set domain metadata URI for domain ${domainId}`);
  const isLocked = true;
  const signerAddress = await signer.getAddress();
  const registrar = await getRegistrarForDomain(hub, domainId);

  await validateOwnerAndStatus(domainId, registrar, signerAddress, isLocked);

  const tx = await registrar
    .connect(signer)
    .setDomainMetadataUri(domainId, metadataUri);
  return tx;
};
