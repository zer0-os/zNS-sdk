import { Domain } from "../../types";
import * as actions from "./actions";
import { getLogger } from "../../utilities";

const logger = getLogger("api:client");

export interface DataStoreApiClient {
  getDomainsByOwner: (ownerAddress: string) => Promise<Domain[]>;
  getSubdomainsById: (tokenId: string) => Promise<Domain[]>;
}

export const createDataStoreApiClient = (
  apiUri: string
): DataStoreApiClient => {
  const apiClient: DataStoreApiClient = {
    getDomainsByOwner: async (ownerAddress: string) => {
      logger.debug("Calling to getDomainsByOwner");
      const domains: Domain[] = await actions.getDomainsByOwner(
        apiUri,
        ownerAddress
      );

      return domains;
    },
    getSubdomainsById: async (tokenId: string) => {
      logger.debug("Calling to getSubdomainsById");
      const domains: Domain[] = await actions.getSubdomainsById(
        apiUri,
        tokenId
      );

      return domains;
    },
  };

  return apiClient;
};
