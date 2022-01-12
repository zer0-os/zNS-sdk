import { Registrar } from "../contracts/types";
import { DomainMetadata, IPFSGatewayUri } from "../types";
import { getMetadataFromUri } from "./getMetadataFromUri";

export const getDomainMetadata = async (
  domainId: string,
  registrar: Registrar,
  ipfsGatewayUri: IPFSGatewayUri
): Promise<DomainMetadata> => {
  const metadataUri = await registrar.tokenURI(domainId);
  const metadata = await getMetadataFromUri(metadataUri, ipfsGatewayUri);
  return metadata;
};
