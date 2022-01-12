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
  desiredLock: boolean
) => {
  const currentLock = await registrar.isDomainMetadataLocked(domainId);
  if (currentLock === desiredLock)
    throw Error("Metadata must be unlocked to be modified");
};

export const validateOwnerAndStatus = async (
  domainId: string,
  registrar: Registrar,
  potentialOwner: string,
  desiredLock: boolean,
) => {
  await validateUserOwnsDomain(domainId, potentialOwner, registrar);
  await validateStatus(domainId, registrar, desiredLock);
};
