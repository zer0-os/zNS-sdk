import * as ethers from "ethers"
import { Registrar } from "../contracts/types";
import { validateOwner, validateStatus } from "./helpers";

export const setDomainMetadata = async (
  domainId: string,
  metadataUri: string,
  potentialOwner: string,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  validateOwner(domainId, potentialOwner, registrar, "Cannot set metadata of unowned domain")
  validateStatus(domainId, registrar, "Locked metadata cannot be modified");
  
  const tx = await registrar.setDomainMetadataUri(domainId, metadataUri)
  return tx;
};
