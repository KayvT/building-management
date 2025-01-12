import { gql } from "@apollo/client";

export const GET_LOCATION = gql`
  query GetLocation($id: ID!) {
    location(id: $id) {
      id
      name
      occupancy
      locationType
      spots {
        id
        name
      }
    }
  }
`;
