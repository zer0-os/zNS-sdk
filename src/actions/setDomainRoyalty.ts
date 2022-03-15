import * as ethers from "ethers";
import { Registrar, ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";
import { validateUserOwnsDomain } from "./helpers";

export const setDomainRoyalty = async (
  domainId: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  const signerAddress = await signer.getAddress();
  const registrar = await getRegistrarForDomain(hub, domainId);

  await validateUserOwnsDomain(domainId, signerAddress, registrar);

  const tx = await registrar
    .connect(signer)
    .setDomainRoyaltyAmount(domainId, amount);
  return tx;
};
