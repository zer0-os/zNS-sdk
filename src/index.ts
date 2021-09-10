import * as subgraph from "./subgraph";
import { Domain, DomainTradingData } from "./types";
import * as zAuction from "@zero-tech/zauction-sdk";
import { getSubdomainTradingData } from "./trading";

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
    getSubdomainTradingData: (domainId: string) =>
      getSubdomainTradingData(
        domainId,
        subgraphClient.getSubdomainsById,
        (domainId: string) =>
          zAuctionInstance.listSales(znsRegistryAddress, domainId)
      ),
  };

  return instance;
};
