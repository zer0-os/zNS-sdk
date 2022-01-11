import { Registrar } from "../contracts/types";
import { DomainMetadata, IPFSGatewayUri } from "../types";
import { downloadMetadataFromUri } from "./downloadMetadataFromUri";

export const getDomainMetadata = async (
  domainId: string,
  registrar: Registrar,
  ipfsGatewayUri: IPFSGatewayUri
): Promise<DomainMetadata> => {
  const metadataUri = await registrar.tokenURI(domainId);
  const metadata = await downloadMetadataFromUri(metadataUri, ipfsGatewayUri);
  return metadata;
};
