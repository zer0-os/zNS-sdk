import * as subgraph from "./subgraph";
import * as actions from "./actions";
import { Domain, DomainEvent, DomainTradingData } from "./types";
import * as zAuction from "@zero-tech/zauction-sdk";

export * from "./types";

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
   * Gets trading data for a sub domain.
   * @param domainId Domain id to get subdomain trading data for
   */
  getSubdomainTradingData(domainId: string): Promise<DomainTradingData>;
}

export const createInstance = (
  znsRegistryAddress: string,
  subgraphUri: string,
  zAuctionInstance: zAuction.Instance
): Instance => {
  const subgraphClient = subgraph.createClient(subgraphUri);

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
    getSubdomainTradingData: (domainId: string) =>
      actions.getSubdomainTradingData(
        domainId,
        subgraphClient.getSubdomainsById,
        (domainId: string) =>
          zAuctionInstance.listSales(znsRegistryAddress, domainId)
      ),
  };

  return instance;
};
