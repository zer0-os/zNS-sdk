import { Registrar } from "../../contracts/types";

export const validateUserOwnsDomain = async (
  domainId: string,
  potentialOwner: string,
  registrar: Registrar
) => {
  const owner = await registrar.ownerOf(domainId);
  if (potentialOwner !== owner)
    throw Error("Must own domain to modify");
};

export const validateStatus = async (
  domainId: string,
  registrar: Registrar,
  lockStatus: boolean
) => {
  const record = await registrar.records(domainId);
  if (record.metadataLocked === lockStatus)
    throw Error("Metadata must be unlocked to be modified");
};

export const validateOwnerAndStatus = async (
  domainId: string,
  registrar: Registrar,
  potentialOwner: string,
  lockStatus: boolean,
) => {
  validateUserOwnsDomain(domainId, potentialOwner, registrar);
  validateStatus(domainId, registrar, lockStatus);
};
