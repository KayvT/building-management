import { gql } from "@apollo/client";

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

export const GET_LOCATION_OCCUPANCY = gql`
  query GetLocationOccupancy($id: ID!) {
    location(id: $id) {
      occupancy
    }
  }
`;
