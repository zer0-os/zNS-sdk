import { Domain, Maybe } from "../../types";
import * as actions from "./actions";
import { getLogger } from "../../utilities";
import {
  DomainSortOptions,
  ResourceAssociation,
  ResourceRegistry
} from "./types";

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
    sort?: DomainSortOptions,
    nameFilter?: string,
  ) => Promise<Domain[]>;
  getSubdomainsByIdDeep: (
    tokenId: string,
    limit: number,
    skip: number,
    sort?: DomainSortOptions,
    nameFilter?: string,
  ) => Promise<Domain[]>;
  getMostRecentSubdomainsById: (
    tokenId: string,
    limit: number,
    skip: number
  ) => Promise<Domain[]>;
  getDomainResourceAssociations: (
    domainId: string
  ) => Promise<ResourceAssociation[]>;
  getResourceRegistry: (
    resourceType: string
  ) => Promise<Maybe<ResourceRegistry>>;
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
      sort?: DomainSortOptions,
      nameFilter?: string
    ) => {
      logger.debug("Calling to getSubdomainsById");
      const domains: Domain[] = await actions.getSubdomainsById(
        apiUri,
        tokenId,
        limit,
        skip,
        sort,
        nameFilter,
      );

      return domains;
    },
    getSubdomainsByIdDeep: async (
      tokenId: string,
      limit: number,
      skip: number,
      sort?: DomainSortOptions,
      nameFilter?: string
    ) => {
      logger.debug("Calling to getSubdomainsByIdDeep");
      const domains: Domain[] = await actions.getSubdomainsByIdDeep(
        apiUri,
        tokenId,
        limit,
        skip,
        sort,
        nameFilter,
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

    getDomainResourceAssociations: async (
      domainId: string
    ): Promise<ResourceAssociation[]> => {
      logger.debug("Calling to getDomainResourceAssociations");
      const resourceAssociations: ResourceAssociation[] =
        await actions.getDomainResourceAssociations(apiUri, domainId);

      return resourceAssociations;
    },

    getResourceRegistry: async (
      resourceType: string
    ): Promise<Maybe<ResourceRegistry>> => {
      logger.debug("Calling to getResourceRegistry");
      const resourceRegistry: Maybe<ResourceRegistry> =
        await actions.getResourceRegistry(apiUri, resourceType);

      return resourceRegistry;
    },
  };

  return apiClient;
};
