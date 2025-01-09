import { gql } from "@apollo/client";

export const GET_ALL_TENANTS = gql`
  query GetAllTenants {
    tenants {
      id
      name
    }
  }
`;
