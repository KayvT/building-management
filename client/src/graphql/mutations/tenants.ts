import { gql } from "@apollo/client";

export const createTenant = gql`
  mutation CreateTenant($name: String!) {
    createTenant(name: $name) {
      name
      id
    }
  }
`;
