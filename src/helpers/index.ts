import { ethers } from "ethers";
import { getRegistrar } from "../contracts";
import { Registrar, ZNSHub } from "../contracts/types";

export const getRegistrarForDomain = async (
  hub: ZNSHub,
  domainId: string
): Promise<Registrar> => {
  let registrarAddress;

  try {
    registrarAddress = await hub.getRegistrarForDomain(domainId);
  } catch (e) {
    throw Error(`Failed to access hub: ${e}`);
  }

  if (registrarAddress === ethers.constants.AddressZero) {
    throw Error(`Null address for registrar.`);
  }

  const contract = getRegistrar(hub.provider, registrarAddress);
  return contract;
};
