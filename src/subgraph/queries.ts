import { gql } from "@apollo/client/core";

export const getDomainById = gql`
  query Domain($id: ID!) {
    domain(id: $id) {
      id
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
      lockedBy
      isLocked
      metadata
    }
  }
`;

export const getDomainsByName = gql`
  query Domains($name: String!) {
    domains(where: { name_contains: $name }) {
      id
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
      lockedBy
      isLocked
      metadata
    }
  }
`;

export const getSubdomainsById = gql`
  query Subdomains($parent: ID!, $count: Int!, $skipAmount: Int!) {
    domains(where: { parent: $parent }, first: $count, skip: $skipAmount) {
      id
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
      lockedBy
      isLocked
      metadata
    }
  }
`;

export const getDomainsByOwner = gql`
  query Domains($owner: Bytes!) {
    domains(where: { name_not: null, owner: $owner }) {
      id
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
      lockedBy
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
      lockedBy
      isLocked
      metadata
    }
  }
`;
