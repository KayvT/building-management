import { gql } from "@apollo/client";

export const GET_ALL_TENANTS = gql`
  query GetAllTenants {
    tenants {
      id
      name
    }
  }
`;

export const GET_TENANT = gql`
  query GetTenant {
    tenant {
      id
      name
    }
  }
`;

export const GET_TOPOLOGY = gql`
  query GetTopology {
    tenant {
      id
      name
      floors {
        id
        name
        locations {
          id
          name
          spots {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_ENTRY = gql`
  query GetEntry($tenantId: String!, $entryId: String!, $entryType: String!) {
    entry(tenantId: $tenantId, entryId: $entryId, entryType: $entryType) {
      id
      name
    }
  }
`;
