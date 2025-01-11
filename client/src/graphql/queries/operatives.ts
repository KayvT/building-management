import { gql } from "@apollo/client";

export const GET_OPERATIVES = gql`
  query GetOperatives {
    tenant {
      operatives {
        name
        id
      }
    }
  }
`;
export const GET_LOCATIONS = gql`
  query GetLocations {
      floors {
        locations {
          id
          name
      }
    }
  }
`;
