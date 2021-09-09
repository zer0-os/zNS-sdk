import * as subgraph from "./subgraph";
import { Domain } from "./types";

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
}

export const createInstance = (subgraphUri: string): Instance => {
  const subgraphClient = subgraph.createClient(subgraphUri);

  const instance: Instance = {
    getDomainById: subgraphClient.getDomainById,
    getDomainsByName: subgraphClient.getDomainsByName,
    getDomainsByOwner: subgraphClient.getDomainsByOwner,
    getSubdomainsById: subgraphClient.getSubdomainsById,
  };

  return instance;
};
