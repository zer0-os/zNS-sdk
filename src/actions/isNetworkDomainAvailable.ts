import { domainNameToId, getLogger } from "../utilities";
import { ZNSHub } from "../contracts/types";
import { checkContentModeration } from "../api/actions";

const logger = getLogger("actions:getDomainMetadata");

export const isNetworkDomainAvailable = async (
  name: string,
  hub: ZNSHub,
  apiUri: string
): Promise<boolean> => {
    logger.trace(`Checking network domain availability for: ${name}`);
    // Check if name passes validation
    let moderation = await checkContentModeration(apiUri, name);
    if (moderation?.flagged ?? false)
    {
        logger.trace(`${name}: was flagged for review, with reason: ${moderation?.reason}`);
        return false;
    }
    //Check domain availability
    let id = domainNameToId(name);
    const available = await hub.domainExists(id)
    return available;
};
