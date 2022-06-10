import * as ethers from "ethers";
import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";
import { validateUserOwnsDomain } from "./helpers";
import { getLogger } from "../utilities";

const logger = getLogger("actions:setDomainRoyalty");

export const setDomainRoyalty = async (
  domainId: string,
  amount: ethers.BigNumber,
  signer: ethers.Signer,
  hub: ZNSHub
): Promise<ethers.ContractTransaction> => {
  logger.trace(
    `Calling to set royalty of ${amount.toString()} for domain ${domainId}`
  );
  const signerAddress = await signer.getAddress();
  const registrar = await getRegistrarForDomain(hub, domainId);

  await validateUserOwnsDomain(domainId, signerAddress, registrar);

  const tx = await registrar
    .connect(signer)
    .setDomainRoyaltyAmount(domainId, amount);
  return tx;
};
