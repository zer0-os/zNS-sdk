import { Domain } from "../../types";
import * as actions from "./actions";
import { getLogger } from "../../utilities";

const logger = getLogger("api:client");

export interface DataStoreApiClient {
  getSubdomainsById: (tokenId: string) => Promise<Domain[]>;
}

export const createDataStoreApiClient = (
  apiUri: string
): DataStoreApiClient => {
  const apiClient: DataStoreApiClient = {
    getSubdomainsById: async (tokenId: string) => {
      logger.debug("Calling to getSubdomainsById");
      let domains: Domain[] = await actions.getSubdomainsById(apiUri, tokenId);

      return domains;
    },
  };

  return apiClient;
};
