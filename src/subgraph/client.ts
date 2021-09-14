import * as apollo from "@apollo/client/core";
import fetch from "cross-fetch";
import { Domain, DomainMintEvent, DomainTransferEvent } from "../types";
import * as actions from "./actions";

export interface SubgraphClient {
  getDomainById(domainId: string): Promise<Domain>;
  getDomainsByName(name: string): Promise<Domain[]>;
  getDomainsByOwner(owner: string): Promise<Domain[]>;
  getSubdomainsById(domainId: string): Promise<Domain[]>;
  getDomainTransferEvents(domainId: string): Promise<DomainTransferEvent[]>;
  getDomainMintedEvent(domainId: string): Promise<DomainMintEvent>;
}

const createApolloClient = (
  subgraphUri: string
): apollo.ApolloClient<apollo.NormalizedCacheObject> => {
  const client = new apollo.ApolloClient({
    link: new apollo.HttpLink({ uri: subgraphUri, fetch }),
    cache: new apollo.InMemoryCache(),
  });

  return client;
};

export const createClient = (subgraphUri: string): Promise<SubgraphClient> => {
  const apolloClient = createApolloClient(subgraphUri);

  const subgraphClient: SubgraphClient = {
    getDomainById: async (domainId: string): Promise<Domain> => {
      const domain = await actions.getDomainById(apolloClient, domainId);
      return domain;
    },
    getDomainsByName: async (name: string): Promise<Domain[]> => {
      const domains = await actions.getDomainsByName(apolloClient, name);
      return domains;
    },
    getDomainsByOwner: async (owner: string): Promise<Domain[]> => {
      const domains = await actions.getDomainsByOwner(apolloClient, owner);
      return domains;
    },
    getSubdomainsById: async (domainId: string): Promise<Domain[]> => {
      const domains = await actions.getSubdomainsById(apolloClient, domainId);
      return domains;
    },
    getDomainTransferEvents: async (
      domainId: string
    ): Promise<DomainTransferEvent[]> => {
      const events = await actions.getDomainTransferEvents(
        apolloClient,
        domainId
      );
      return events;
    },
    getDomainMintedEvent: async (
      domainId: string
    ): Promise<DomainMintEvent> => {
      const event = await actions.getDomainMintEvent(apolloClient, domainId);
      return event;
    },
  };

  return subgraphClient;
};
