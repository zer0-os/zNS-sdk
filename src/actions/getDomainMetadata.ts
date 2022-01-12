import { Registrar } from "../contracts/types";
import { DomainMetadata, IPFSGatewayUri } from "../types"
import { makeApiCall } from "../api/actions/helpers";

export const getDomainMetadata = async (
  domainId: string,
  registrar: Registrar,
  ipfsGatewayUri: IPFSGatewayUri
): Promise<DomainMetadata> => {
  const metadataUri = await registrar.tokenURI(domainId);

  let metadata: DomainMetadata;
  if (!metadataUri.includes("https")) {
    // If domain uri is ipfs uri we must format it for https
    // e.g. ipfs://Qm...
    const qmHash = metadataUri.split("//")[1];
    const formattedUri = `https://${ipfsGatewayUri}/ipfs/${qmHash}`;

    metadata = await makeApiCall<DomainMetadata>(formattedUri, "GET");
  } else {
    metadata = await makeApiCall<DomainMetadata>(metadataUri, "GET");
  }
  return metadata;
}
