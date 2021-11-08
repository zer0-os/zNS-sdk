import { BigNumberish, ethers } from "ethers";
import { Registrar } from "../contracts/types";
import { validateOwner, validateStatus } from "./helpers";

export const setAndLockDomainMetadata = async (
  domainId: BigNumberish,
  metadataUri: string,
  potentialOwner: string,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  validateOwner(domainId, potentialOwner, registrar, "Cannot set metadata of unowned domain")
  validateStatus(domainId, registrar, "Locked metadata cannot be modified");
  
  // Always will call with lockStatus: true, so can ignore
  const tx = await registrar.setAndLockDomainMetadata(domainId, metadataUri)
  return tx;
}
