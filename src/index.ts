import * as subgraph from "./subgraph";
import * as api from "./api";
import * as actions from "./actions";
import * as zAuction from "./zAuction";
import {
  Domain,
  DomainEvent,
  DomainTradingData,
  MintSubdomainStatusCallback,
  SubdomainParams,
  zAuctionRoute,
} from "./types";
import { getZAuctionInstanceForDomain } from "./utilities";
import { ethers } from "ethers";
import { getBasicController } from "./contracts";

export * from "./types";

export interface Config {
  subgraphUri: string;
  apiUri: string;
  zAuctionRoutes: zAuctionRoute[];
  basicController: string;
}

/**
 * An instance of the zNS SDK
 */
export interface Instance {
  /**
   * Gets domain data for a domain
   * @param domainId Id of a domain
   */
  getDomainById(domainId: string): Promise<Domain>;

  /**
   * Finds domains whose name has *name* in their name
   * @param name domain name search pattern
   */
  getDomainsByName(name: string): Promise<Domain[]>;

  /**
   * Gets all domains owner by an address
   * @param owner Owner address
   */
  getDomainsByOwner(owner: string): Promise<Domain[]>;

  /**
   * Finds all subdomains of a given domain
   * @param domainId (parent) domain id
   */
  getSubdomainsById(domainId: string): Promise<Domain[]>;

  /**
   * Gets all domain events for a domain
   * @param domainId Domain id to get events for
   */
  getDomainEvents(domainId: string): Promise<DomainEvent[]>;

  /**
   * Gets the zAuction Instance for a domain.
   * @param domainId Domain id to fetch for
   */
  getZAuctionInstanceForDomain(domainId: string): Promise<zAuction.Instance>;

  /**
   * Gets trading data for a sub domain.
   * @param domainId Domain id to get subdomain trading data for
   */
  getSubdomainTradingData(domainId: string): Promise<DomainTradingData>;

  /**
   * Mints a new subdomain
   * @param params The subdomain parameters
   * @param signer The signer (wallet to create sub domain)
   * @param statusCallback Callback to know when each step completes
   */
  mintSubdomain(
    params: SubdomainParams,
    signer: ethers.Signer,
    statusCallback?: MintSubdomainStatusCallback
  ): Promise<ethers.ContractTransaction>;
}

export const createInstance = (config: Config): Instance => {
  const subgraphClient = subgraph.createClient(config.subgraphUri);
  const apiClient = api.createClient(config.apiUri);

  const domainIdToDomainName = async (domainId: string) => {
    const domainData = await subgraphClient.getDomainById(domainId);
    return domainData.id;
  };

  const instance: Instance = {
    getDomainById: subgraphClient.getDomainById,
    getDomainsByName: subgraphClient.getDomainsByName,
    getDomainsByOwner: subgraphClient.getDomainsByOwner,
    getSubdomainsById: subgraphClient.getSubdomainsById,
    getDomainEvents: async (domainId: string) => {
      const zAuctionInstance = await getZAuctionInstanceForDomain(
        domainId,
        config.zAuctionRoutes,
        domainIdToDomainName
      );

      return actions.getDomainEvents(domainId, {
        getMintEvents: subgraphClient.getDomainMintedEvent,
        getTransferEvents: subgraphClient.getDomainTransferEvents,
        getBidEvents: zAuction.getBidEventsFunction(zAuctionInstance),
        getSaleEvents: zAuction.getSaleEventsFunction(zAuctionInstance),
      });
    },
    getZAuctionInstanceForDomain: (domainId: string) =>
      getZAuctionInstanceForDomain(
        domainId,
        config.zAuctionRoutes,
        domainIdToDomainName
      ),
    getSubdomainTradingData: async (
      domainId: string
    ): Promise<DomainTradingData> => {
      const zAuctionInstance = await getZAuctionInstanceForDomain(
        domainId,
        config.zAuctionRoutes,
        domainIdToDomainName
      );

      const tradingData = await actions.getSubdomainTradingData(
        domainId,
        subgraphClient.getSubdomainsById,
        (domainId: string) => zAuctionInstance.listSales(domainId)
      );
      return tradingData;
    },
    mintSubdomain: async (
      params: SubdomainParams,
      signer: ethers.Signer,
      statusCallback?: MintSubdomainStatusCallback
    ): Promise<ethers.ContractTransaction> => {
      const basicController = await getBasicController(
        signer,
        config.basicController
      );
      const owner = await signer.getAddress();

      const tx = await actions.mintSubdomain(
        params,
        owner,
        basicController.registerSubdomainExtended,
        apiClient.uploadMedia,
        apiClient.uploadMetadata,
        statusCallback
      );

      return tx;
    },
  };

  return instance;
};
