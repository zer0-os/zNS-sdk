import { Registrar } from "../../contracts/types";

import { getLogger } from "../../utilities";

const logger = getLogger("actions:helpers");

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
  logger.trace(
    `Validate the potential owner ${potentialOwner} of domain ${domainId} and set lock status to ${desiredLock}`
  );
  await validateUserOwnsDomain(domainId, potentialOwner, registrar);
  await validateStatus(domainId, registrar, desiredLock, potentialOwner);
};
