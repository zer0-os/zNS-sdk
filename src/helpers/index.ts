import { ethers } from "ethers";
import { getRegistrar } from "../contracts";
import { ZNSHub } from "../contracts/types";

export const getContractForDomain = async (hub: ZNSHub, domainId: string) => {
  try {
    let registrarAddress;
    try {
      registrarAddress = await hub.domainToContract(domainId);
    } catch (e) {
      throw Error(`Failed to access hub: ${e}`);
    }

    if (registrarAddress === ethers.constants.AddressZero) {
      throw Error(`Null address for registrar.`);
    }
    const contract = getRegistrar(hub.provider, registrarAddress);
    return contract;
  } catch (e) {
    throw Error(
      `Failed to get Registrar for domain '${domainId}' Reason: ${e}`
    );
  }
};
