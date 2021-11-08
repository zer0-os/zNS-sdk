import { ethers } from "ethers";
import { Registrar } from "../contracts/types";
import { validateOwner, validateStatus } from "./helpers";

export const lockDomainMetadata = async (
  domainId: string,
  lockStatus: boolean,
  potentialOwner: string,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  validateOwner(
    domainId,
    potentialOwner,
    registrar,
    "Cannot set metadata of unowned domain"
  );
  validateStatus(domainId, registrar, "Metadata already locked");

  const tx = await registrar.lockDomainMetadata(domainId, lockStatus);
  return tx;
};
