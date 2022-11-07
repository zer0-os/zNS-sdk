import { Domain } from "../../types";
import * as actions from "./actions";
import { getLogger } from "../../utilities";
import { DomainSortOptions } from "./helpers/desiredSortToQueryParams";

const logger = getLogger("api:client");

export interface DataStoreApiClient {
  getDomainById: (tokenId: string) => Promise<Domain>;
  getDomainsByOwner: (
    ownerAddress: string,
    limit: number,
    skip: number,
    sort?: DomainSortOptions
  ) => Promise<Domain[]>;
  getSubdomainsById: (
    tokenId: string,
    limit: number,
    skip: number,
    sort?: DomainSortOptions
  ) => Promise<Domain[]>;
  getMostRecentSubdomainsById: (
    tokenId: string,
    limit: number,
    skip: number
  ) => Promise<Domain[]>;
}

export const createDataStoreApiClient = (
  apiUri: string
): DataStoreApiClient => {
  const apiClient: DataStoreApiClient = {
    getDomainById: async (domainId: string) => {
      logger.debug("Calling to getDomainById");
      const domain: Domain = await actions.getDomainById(apiUri, domainId);

      return domain;
    },

    getDomainsByOwner: async (
      ownerAddress: string,
      limit: number,
      skip: number,
      sort?: DomainSortOptions
    ) => {
      logger.debug("Calling to getDomainsByOwner");
      const domains: Domain[] = await actions.getDomainsByOwner(
        apiUri,
        ownerAddress,
        limit,
        skip,
        sort
      );

      return domains;
    },
    getSubdomainsById: async (
      tokenId: string,
      limit: number,
      skip: number,
      sort?: DomainSortOptions
    ) => {
      logger.debug("Calling to getSubdomainsById");
      const domains: Domain[] = await actions.getSubdomainsById(
        apiUri,
        tokenId,
        limit,
        skip,
        sort
      );

      return domains;
    },

    getMostRecentSubdomainsById: async (
      tokenId: string,
      limit: number,
      skip: number
    ) => {
      logger.debug("Calling to getMostRecentSubdomainsById");
      const domains: Domain[] = await actions.getMostRecentSubdomainsById(
        apiUri,
        tokenId,
        limit,
        skip
      );

      return domains;
    },
  };

  return apiClient;
};
