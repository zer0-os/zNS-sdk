import { gql } from "@apollo/client/core";

export const getDomainById = gql`
  query Domain($id: ID!) {
    domain(id: $id) {
      id
      indexId
      name
      parent {
        id
      }
      owner {
        id
      }
      minter {
        id
      }
      lockedBy {
        id
      }
      contract {
        id
      }
      isLocked
      metadata
    }
  }
`;

export const getDomainsByName = gql`
  query Domains($name: String!) {
    domains(where: { name_contains: $name }) {
      id
      indexId
      name
      parent {
        id
      }
      owner {
        id
      }
      minter {
        id
      }
      lockedBy {
        id
      }
      contract {
        id
      }
      isLocked
      metadata
    }
  }
`;

export const getSubdomainsById = gql`
  query Subdomains($parent: ID!, $count: Int!, $startIndex: Int!) {
    domains(
      where: { parent: $parent, indexId_gt: $startIndex }
      first: $count
      orderBy: indexId
      orderDirection: asc
    ) {
      id
      indexId
      name
      parent {
        id
      }
      owner {
        id
      }
      minter {
        id
      }
      lockedBy {
        id
      }
      contract {
        id
      }
      isLocked
      metadata
    }
  }
`;

export const getDomainsByOwner = gql`
  query Domains($owner: Bytes!) {
    domains(where: { name_not: null, owner: $owner }) {
      id
      indexId
      name
      parent {
        id
      }
      owner {
        id
      }
      minter {
        id
      }
      lockedBy {
        id
      }
      contract {
        id
      }
      isLocked
      metadata
    }
  }
`;

export const getDomainTransfers = gql`
  query DomainTransfers($id: ID!) {
    domainTransferreds(where: { domain: $id }) {
      timestamp
      from {
        id
      }
      to {
        id
      }
    }
  }
`;

export const getDomainMintEvent = gql`
  query DomainMinted($id: ID!) {
    domainMinted(id: $id) {
      timestamp
      minter {
        id
      }
    }
  }
`;

export const getAllDomains = gql`
  query Domains($count: Int!, $startIndex: Int!) {
    domains(
      first: $count
      where: { indexId_gt: $startIndex }
      orderBy: indexId
    ) {
      id
      indexId
      name
      parent {
        id
      }
      owner {
        id
      }
      minter {
        id
      }
      lockedBy {
        id
      }
      contract {
        id
      }
      isLocked
      metadata
    }
  }
`;

export const getPastNDomains = gql`
  query Domains($count: Int!, $startIndex: Int!) {
    domains(
      first: $count
      orderBy: indexId
      skip: $startIndex
      orderDirection: desc
    ) {
      id
      indexId
      name
      parent {
        id
      }
      owner {
        id
      }
      minter {
        id
      }
      lockedBy {
        id
      }
      contract {
        id
      }
      isLocked
      metadata
    }
  }
`;
