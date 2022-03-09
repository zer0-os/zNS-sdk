import { ethers } from "ethers";
import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";
import { validateOwnerAndStatus } from "./helpers";

export const setAndLockDomainMetadataUri = async (
  domainId: string,
  metadataUri: string,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  const isLocked = true;
  const signerAddress = await signer.getAddress();
  const registrar = await getRegistrarForDomain(hub, domainId);

  await validateOwnerAndStatus(domainId, registrar, signerAddress, isLocked);

  const tx = await registrar
    .connect(signer)
    .setAndLockDomainMetadata(domainId, metadataUri);
  return tx;
};
