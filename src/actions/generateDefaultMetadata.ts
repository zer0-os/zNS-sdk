import { DomainMetadata } from "../types";
import { ApiClient } from "../api";
import { getLogger } from "../utilities";

const logger = getLogger("actions:generateDefaultMetadata");

export const generateDefaultMetadata = async (
  apiClient: ApiClient,
  name: string
): Promise<string> => {
    const domainMetaData: DomainMetadata = {
        name: `0://${name}`,
        description: `0://${name} - A Zero Name Service (zNS) Root Domain on the Ethereum Blockchain`,
        image: "ipfs://QmXni8ehkAiwpgBLRsdKTfEZKvRcZgNJF2vVws3QoRLS6Q" //TEMPORARY, CURRENTLY WILDER BEASTS,
    }
    logger.trace(`Generating default metadata for: ${name}`);
    const metadataUri = await apiClient.uploadMetadata(domainMetaData);
    logger.trace(`IPFS Uri generated: ${metadataUri}`);
    return metadataUri;
};
