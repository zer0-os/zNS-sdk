import { ethers } from "ethers";
import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";

export const transferOwnership = async (
  to: string,
  domainId: string,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  const signerAddress = await signer.getAddress();
  const registrar = await getRegistrarForDomain(hub, domainId);
  const currentOwner = await registrar.ownerOf(domainId);

  if (signerAddress !== currentOwner) {
    throw new Error(`Signer ${signerAddress} is not the owner of ${domainId}`);
  }

  const tx = await registrar
    .connect(signer)
    ["safeTransferFrom(address,address,uint256)"](signerAddress, to, domainId);

  console.log(tx);
  return tx;
};
