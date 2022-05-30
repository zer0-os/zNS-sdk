import { ZNSHub } from "../contracts/types";
import { getRegistrarForDomain } from "../helpers";
import { DomainMetadata, IPFSGatewayUri } from "../types";
import { getMetadataFromUri } from "./getMetadataFromUri";
import { getLogger } from "../utilities";

const logger = getLogger("actions:getDomainMetadata");

export const getDomainMetadata = async (
  domainId: string,
  hub: ZNSHub,
  ipfsGatewayUri: IPFSGatewayUri
): Promise<DomainMetadata> => {
  logger.trace(`Get domain metadata for ${domainId}`);
  const registrar = await getRegistrarForDomain(hub, domainId);
  const metadataUri = await registrar.tokenURI(domainId);
  const metadata = await getMetadataFromUri(metadataUri, ipfsGatewayUri);
  return metadata;
};
