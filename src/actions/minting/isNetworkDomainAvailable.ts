import { domainNameToId, getLogger } from "../../utilities";
import { ZNSHub } from "../../contracts/types";
import { znsApiClient } from "../../api";

const logger = getLogger("actions:isNetworkDomainAvailable");

export const isNetworkDomainAvailable = async (
  name: string,
  hub: ZNSHub,
  apiClient: znsApiClient
): Promise<boolean> => {
  logger.trace(`Checking network domain availability for: ${name}`);

  // A name is not available if it is above the max length of 32 characters
  if (!name || name.length > 32) {
    logger.trace(`Domain name '${name} is beyond the maximum name length.`);
    return false;
  }
  
  // Check if name passes validation
  const moderation = await apiClient.checkContentModeration(name);
  if (moderation.flagged) {
    logger.trace(
      `${name}: was flagged for review, with reason: ${moderation?.reason}`
    );
    return false;
  }
  // Check domain availability
  const id = domainNameToId(name);
  const available = !(await hub.domainExists(id));
  return available;
};
