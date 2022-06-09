import { getRegistrarForDomain } from "../helpers";
import { DomainMetadata } from "../types";
import { getLogger } from "../utilities";
import { ethers } from "ethers";
import { getDomainPurchaserContract, getRegistrar } from "../contracts";
import { DomainPurchaser } from "../contracts/types/DomainPurchaser";

const logger = getLogger("actions:getDomainMetadata");

export const getPriceOfNetworkDomain = async (
  name: string,
  domainPurchaser: DomainPurchaser,
  signer: ethers.Signer
): Promise<number> => {
    //const signerAddress = await signer.getAddress();
    //const registrar = await getRegistrarForDomain(hub, domainId);
    //const contract = getDomainPurchaserContract(signer, Config.domainPurchaser);
    //const contract2 = getRegistrar(hub.provider, registrarAddress);

    // const tx = await domainPurchaser
    //   .connect(signer)
    //   .get(domainId, desiredLock);
    return 1;
};
