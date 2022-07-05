import { domainNameToId, getLogger } from "../../utilities";
import { ZNSHub } from "../../contracts/types";
import { znsApiClient } from "../../api";

const logger = getLogger("actions:getDomainMetadata");

export const isNetworkDomainAvailable = async (
  name: string,
  hub: ZNSHub,
  apiClient: znsApiClient
): Promise<boolean> => {
  logger.trace(`Checking network domain availability for: ${name}`);
  // Check if name passes validation
  const moderation = await apiClient.checkContentModeration(name);
  if (moderation.flagged) {
    logger.trace(
      `${name}: was flagged for review, with reason: ${moderation?.reason}`
    );
    return false;
  }
  //Check domain availability
  const id = domainNameToId(name);
  const available = !(await hub.domainExists(id));
  return available;
};
