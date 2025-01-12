import { gql } from "@apollo/client";

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
