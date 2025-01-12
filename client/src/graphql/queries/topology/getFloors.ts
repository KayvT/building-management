import { gql } from "@apollo/client";

export const GET_FLOOR = gql`
  query GetFloor($id: ID!) {
    floor(id: $id) {
      id
      name
      locations {
        id
        name
        occupancy
        spots {
          id
        }
      }
    }
  }
`;
