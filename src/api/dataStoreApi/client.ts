import * as dotenv from "dotenv";
import * as env from "env-var";
import { Domain } from "../../types";
import * as actions from "./actions";
import { getLogger } from "../../utilities";

dotenv.config();
const logger = getLogger("api:client");

export interface DataStoreApiClient {
  getSubdomainsById: (tokenId: string) => Promise<Domain[]>;
}

export const createDataStoreApiClient = (
  apiUri: string
): DataStoreApiClient => {
  const APIM_KEY = env.get("OCP_APIM_SUBSCRIPTION_KEY").required().asString();
  const apimHeader: Record<string, string> = {
    "Ocp-Apim-Subscription-Key": APIM_KEY,
  };

  const apiClient: DataStoreApiClient = {
    getSubdomainsById: async (tokenId: string) => {
      logger.debug("Calling to getSubdomainsById")
      let domains: Domain[] = await actions.getSubdomainsById(
        tokenId,
        apiUri,
        apimHeader
      );

      return domains;
    },
  };

  return apiClient;
};
