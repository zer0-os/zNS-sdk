import * as apollo from "@apollo/client/core";
import fetch from "cross-fetch";
import { Domain } from "../types";
import * as actions from "./actions";

export interface SubgraphClient {
  getDomainById(domainId: string): Promise<Domain>;
  getDomainsByName(name: string): Promise<Domain[]>;
  getDomainsByOwner(owner: string): Promise<Domain[]>;
  getSubdomainsById(domainId: string): Promise<Domain[]>;
}

const createApolloClient = (subgraphUri: string) => {
  const client = new apollo.ApolloClient({
    link: new apollo.HttpLink({ uri: subgraphUri, fetch }),
    cache: new apollo.InMemoryCache(),
  });

  return client;
};

export const createClient = (subgraphUri: string) => {
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
  };

  return subgraphClient;
};
