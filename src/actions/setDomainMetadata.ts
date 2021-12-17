import * as ethers from "ethers";
import { Registrar } from "../contracts/types";
import { validateUserOwnsDomain, validateStatus } from "./helpers";

export const setDomainMetadata = async (
  domainId: string,
  metadataUri: string,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const potentialOwner = await registrar.signer.getAddress();
  validateUserOwnsDomain(
    domainId,
    potentialOwner,
    registrar,
    "Must own domain to lock metadata"
  );
  validateStatus(domainId, registrar, true, "Metadata must be unlocked to be modified");

  const tx = await registrar.setDomainMetadataUri(domainId, metadataUri);
  return tx;
};
