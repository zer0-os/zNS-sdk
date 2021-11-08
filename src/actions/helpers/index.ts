import { Registrar } from "../../contracts/types";

export const validateUserOwnsDomain = async (
  domainId: string,
  potentialOwner: string,
  registrar: Registrar,
  message: string
) => {
  const owner = await registrar.ownerOf(domainId);
  if (potentialOwner !== owner) throw Error(message);
};

export const validateStatus = async (
  domainId: string,
  registrar: Registrar,
  message: string
) => {
  const record = await registrar.records(domainId);
  if (record.metadataLocked === true) throw Error(message);
};
