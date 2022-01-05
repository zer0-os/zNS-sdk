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
  lockStatus: boolean,
  message: string
) => {
  const record = await registrar.records(domainId);
  if (record.metadataLocked === lockStatus) throw Error(message);
};

export const validateOwnerAndStatus = async (
  domainId: string,
  registrar: Registrar,
  potentialOwner: string,
  lockStatus: boolean,
  ownerMessage: string,
  statusMessage: string
) => {
  validateUserOwnsDomain(
    domainId,
    potentialOwner,
    registrar,
    ownerMessage
  );
  validateStatus(
    domainId,
    registrar,
    lockStatus,
    statusMessage
  );
}