import { ethers } from "ethers";
import { Registrar } from "../contracts/types";

export const transferOwnership = async (
  to: string,
  tokenId: string,
  signer: ethers.Signer,
  registrar: Registrar
): Promise<ethers.ContractTransaction> => {
  const signerAddress = await signer.getAddress();

  const currentOwner = await registrar.ownerOf(tokenId);

  if (signerAddress !== currentOwner) {
    throw new Error(
      "Given address is not the owner, ownership of domain not transferred"
    );
  }

  const tx = await registrar["safeTransferFrom(address,address,uint256)"](
    signerAddress,
    to,
    tokenId
  );

  return tx;
};
