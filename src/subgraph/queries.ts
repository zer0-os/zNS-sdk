import { gql } from "@apollo/client/core";

export const getDomainById = gql`
  query Domain($id: ID!) {
    domain(id: $id) {
      id
      name
      parent {
        id
        name
      }
      subdomains {
        id
        name
        metadata
        owner {
          id
        }
        minter {
          id
        }
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
        name
      }
      subdomains {
        id
        name
        metadata
        owner {
          id
        }
        minter {
          id
        }
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
  query Subdomains($parent: ID!) {
    domains(where: { parent: $parent }) {
      id
      name
      parent {
        id
        name
      }
      subdomains {
        id
        name
        metadata
        owner {
          id
        }
        minter {
          id
        }
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
        name
      }
      subdomains {
        id
        name
        metadata
        owner {
          id
        }
        minter {
          id
        }
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
