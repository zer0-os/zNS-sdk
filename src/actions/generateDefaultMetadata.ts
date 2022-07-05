import { DomainMetadata } from "../types";
import { znsApiClient } from "../api";
import { getLogger } from "../utilities";

const logger = getLogger("actions:generateDefaultMetadata");
const DEFAULT_IMAGE = "ipfs://QmP3uXEBuuJQwWWwLAxGqBAa2sviKCnexyuWKyk6i8NnLJ";
const DEFAULT_IMAGE_FULL =
  "ipfs://QmS6DZzG6pTdWszubmDXzJ7vcEWsPNMGJZuviDaCMc7beB";
const DEFAULT_ANIMATION_URL =
  "ipfs://QmY11GVZDjFjqYKDYur4Z64QCyXGSbgovHXEZzDPYjFNxr";
export const generateDefaultMetadata = async (
  apiClient: znsApiClient,
  name: string
): Promise<string> => {
  const domainMetaData: DomainMetadata = {
    name: `0://${name}`,
    description: `0://${name} - A Zero Name Service (zNS) Root Domain on the Ethereum Blockchain`,
    image: DEFAULT_IMAGE,
    animation_url: DEFAULT_ANIMATION_URL,
    image_full: DEFAULT_IMAGE_FULL,
  };
  logger.trace(`Generating default metadata for: ${name}`);
  const metadataUri = await apiClient.uploadMetadata(domainMetaData);
  logger.trace(`IPFS Uri generated: ${metadataUri}`);
  return metadataUri;
};
