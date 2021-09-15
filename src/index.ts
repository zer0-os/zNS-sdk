import * as subgraph from "./subgraph";
import * as actions from "./actions";
import * as zAuction from "@zero-tech/zauction-sdk";
import { Domain, DomainEvent, DomainTradingData, zAuctionRoute } from "./types";
import { getZAuctionInstanceForDomain } from "./utilities";

export * from "./types";

export interface Config {
  subgraphUri: string;
  zAuctionRoutes: zAuctionRoute[];
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
}

export const createInstance = (config: Config): Instance => {
  const subgraphClient = subgraph.createClient(config.subgraphUri);

  const domainIdToDomainName = async (domainId: string) => {
    const domainData = await subgraphClient.getDomainById(domainId);
    return domainData.id;
  };

  const instance: Instance = {
    getDomainById: subgraphClient.getDomainById,
    getDomainsByName: subgraphClient.getDomainsByName,
    getDomainsByOwner: subgraphClient.getDomainsByOwner,
    getSubdomainsById: subgraphClient.getSubdomainsById,
    getDomainEvents: (domainId: string) =>
      actions.getDomainEvents(
        domainId,
        subgraphClient.getDomainMintedEvent,
        subgraphClient.getDomainTransferEvents
      ),
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
  };

  return instance;
};
