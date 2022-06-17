import { Domain, DomainMintEvent, DomainTransferEvent, Maybe } from "../../types";
import { getLogger } from "../../utilities";

import * as actions from "./actions";
import { createApolloClient } from "../helpers"

const logger = getLogger().withTag("subgraph:client");

export interface SubgraphClient {
  getDomainById(domainId: string): Promise<Domain>;
  getDomainsByName(name: string): Promise<Domain[]>;
  getDomainsByOwner(owner: string): Promise<Domain[]>;
  getSubdomainsById(domainId: string): Promise<Domain[]>;
  getMostRecentSubdomainsById(
    domainId: string,
    count: Maybe<number>,
    skip: Maybe<number>
  ): Promise<Domain[]>;
  getDomainTransferEvents(domainId: string): Promise<DomainTransferEvent[]>;
  getDomainMintedEvent(domainId: string): Promise<DomainMintEvent>;
  getAllDomains(): Promise<Domain[]>;
  getMostRecentDomains(
    count: Maybe<number>,
    skip: Maybe<number>
  ): Promise<Domain[]>;
}

export const createClient = (subgraphUri: string): SubgraphClient => {
  const apolloClient = createApolloClient(subgraphUri);

  const subgraphClient: SubgraphClient = {
    getDomainById: async (domainId: string): Promise<Domain> => {
      logger.debug(`Get domain by id: ${domainId}`);
      const domain = await actions.getDomainById(apolloClient, domainId);
      return domain;
    },
    getDomainsByName: async (name: string): Promise<Domain[]> => {
      logger.debug(`Get domains by name: ${name}`);
      const domains = await actions.getDomainsByName(apolloClient, name);
      return domains;
    },
    getDomainsByOwner: async (owner: string): Promise<Domain[]> => {
      logger.debug(`Get domains by owner: ${owner}`);
      const domains = await actions.getDomainsByOwner(apolloClient, owner);
      return domains;
    },
    getSubdomainsById: async (domainId: string): Promise<Domain[]> => {
      logger.debug(`Get subdomains by id: ${domainId}`);
      const domains = await actions.getSubdomainsById(apolloClient, domainId);
      return domains;
    },
    getMostRecentSubdomainsById: async (
      domainId: string,
      count: Maybe<number>,
      skip: Maybe<number>
    ): Promise<Domain[]> => {
      logger.debug(`Get recent subdomains by id: ${domainId}`);
      const domains = await actions.getMostRecentSubdomainsById(
        apolloClient,
        domainId,
        count,
        skip
      );
      return domains;
    },
    getDomainTransferEvents: async (
      domainId: string
    ): Promise<DomainTransferEvent[]> => {
      logger.debug(`Get domain transfer events by id: ${domainId}`);
      const events = await actions.getDomainTransferEvents(
        apolloClient,
        domainId
      );
      return events;
    },
    getDomainMintedEvent: async (
      domainId: string
    ): Promise<DomainMintEvent> => {
      logger.debug(`Get domain minted events by id: ${domainId}`);
      const event = await actions.getDomainMintEvent(apolloClient, domainId);
      return event;
    },
    getAllDomains: async (): Promise<Domain[]> => {
      logger.debug(`Get domain by all domains`);
      const domains = await actions.getAllDomains(apolloClient);
      return domains;
    },
    getMostRecentDomains: async (
      count: Maybe<number>,
      skip: Maybe<number>
    ): Promise<Domain[]> => {
      logger.debug(`Get recent domains (${count})`);
      const domains = await actions.getMostRecentDomains(
        apolloClient,
        count,
        skip
      );
      return domains;
    },
  };

  return subgraphClient;
};
