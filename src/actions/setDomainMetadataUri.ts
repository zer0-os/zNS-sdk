import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";
import { ethers } from "ethers";

export const setDomainMetadataUri = async (
  domainId: string,
  metadataUri: string,
  signer: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const isLocked = true;
  const signerAddress = await signer.getAddress();

  validateOwnerAndStatus(domainId, registrar, signerAddress, isLocked);

  const tx = await registrar.setDomainMetadataUri(domainId, metadataUri);
  return tx;
};
