import { Registrar } from "../../contracts/types";

export const validateUserOwnsDomain = async (
  domainId: string,
  potentialOwner: string,
  registrar: Registrar
) => {
  const owner = await registrar.ownerOf(domainId);
  if (potentialOwner !== owner) throw Error("Must own domain to modify");
};

export const validateStatus = async (
  domainId: string,
  registrar: Registrar,
  desiredLock: boolean,
  potentialOwner: string
) => {
  const isCurrentlyLocked = await registrar.isDomainMetadataLocked(domainId);
  if (isCurrentlyLocked === desiredLock)
    throw Error("Metadata must be unlocked to be modified");
  if (isCurrentlyLocked) {
    const currentLocker = await registrar.domainMetadataLockedBy(domainId);
    if (currentLocker.toLowerCase() != potentialOwner.toLowerCase()) {
      throw Error(`Only the account that locked the metadata can unlock.`);
    }
  }
};

export const validateOwnerAndStatus = async (
  domainId: string,
  registrar: Registrar,
  potentialOwner: string,
  desiredLock: boolean
) => {
  await validateUserOwnsDomain(domainId, potentialOwner, registrar);
  await validateStatus(domainId, registrar, desiredLock, potentialOwner);
};
