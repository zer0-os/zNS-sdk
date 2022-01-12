import { ethers } from "ethers";
import { Registrar } from "../contracts/types";
import { validateOwnerAndStatus } from "./helpers";

export const setAndLockDomainMetadataUri = async (
  domainId: string,
  metadataUri: string,
  signer: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const isLocked = true;
  const signerAddress = await signer.getAddress();

  await validateOwnerAndStatus(domainId, registrar, signerAddress, isLocked);

  const tx = await registrar
    .connect(signer)
    .setAndLockDomainMetadata(domainId, metadataUri);
  return tx;
};
