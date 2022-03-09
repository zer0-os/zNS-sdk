import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";
import { DomainMetadata, IPFSGatewayUri } from "../types";
import { getMetadataFromUri } from "./getMetadataFromUri";

export const getDomainMetadata = async (
  domainId: string,
  hub: ZNSHub,
  ipfsGatewayUri: IPFSGatewayUri
): Promise<DomainMetadata> => {
  const registrar = await getRegistrarForDomain(hub, domainId);
  const metadataUri = await registrar.tokenURI(domainId);
  const metadata = await getMetadataFromUri(metadataUri, ipfsGatewayUri);
  return metadata;
};
