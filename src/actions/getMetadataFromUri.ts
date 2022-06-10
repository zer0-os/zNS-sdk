import { DomainMetadata, IPFSGatewayUri } from "../types";
import { makeApiCall } from "../api/helpers";
import { getLogger } from "../utilities";

const logger = getLogger("actions:getMetadataFromUri");

export const getMetadataFromUri = async (
  metadataUri: string,
  ipfsGatewayUri: IPFSGatewayUri,
  ipfsGatewayOverride?: string
): Promise<DomainMetadata> => {
  logger.trace(`Get domain metadata from URI ${metadataUri}`);

  const ipfsHashMatcher = /(Qm[a-zA-Z0-9]{44}(\/.+)?)$/;
  const matches = ipfsHashMatcher.exec(metadataUri);

  let metadata: DomainMetadata;

  if (!matches) {
    if (metadataUri.includes("https")) {
      metadata = await makeApiCall<DomainMetadata>(metadataUri, "GET");
      return metadata;
    }
    throw Error(`Unable to parse ${metadataUri} to an IPFS uri`);
  }

  const ipfsHash = matches[1];
  let gateway = ipfsGatewayOverride ?? `https://${ipfsGatewayUri}/ipfs`;

  // Remove trailing / if there is one
  if (gateway[gateway.length - 1] == "/") {
    gateway = gateway.slice(0, gateway.length - 2);
  }

  const formattedUri = `${gateway}/${ipfsHash}`;

  metadata = await makeApiCall<DomainMetadata>(formattedUri, "GET");
  logger.trace(
    `Formatted metadata URI is ${metadataUri} for domain ${metadata.name}`
  );

  return metadata;
};
