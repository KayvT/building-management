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
      floors {
        name
        id
        locations {
          id
        }
      }
    }
  }
`;
