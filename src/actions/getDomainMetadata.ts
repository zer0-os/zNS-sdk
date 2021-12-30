import { Registrar } from "../contracts/types";
import { DomainMetadata } from "../types"
import { makeApiCall } from "../api/actions/helpers";

export const getDomainMetadata = async (domainId: string, registrar: Registrar) => {
  const metadataUri = await registrar.tokenURI(domainId);

  // DomainURI is always one of the two below
  // https://ipfs.fleek.co/ipfs/Qm...
  // ipfs://Qm...
  let metadata: DomainMetadata;
  if (!metadataUri.includes("fleek")) {
    const qmHash = metadataUri.split("//")[1];
    const formattedUri = `https://ipfs.fleek.co/ipfs/${qmHash}`;

    metadata = await makeApiCall<DomainMetadata>(formattedUri, "GET");
  } else {
    metadata = await makeApiCall<DomainMetadata>(metadataUri, "GET");
  }
  return metadata;
}
