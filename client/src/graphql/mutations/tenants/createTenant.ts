import { gql } from "@apollo/client";

export const CREATE_TENANT = gql`
  mutation CreateTenant($name: String!) {
    createTenant(name: $name) {
      name
      id
    }
  }
`;
