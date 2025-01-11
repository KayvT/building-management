import { gql } from "@apollo/client";

export const ADD_FLOOR = gql`
  mutation AddFloor($name: String!) {
    createFloor(name: $name) {
      id
    }
  }
`;

export const ADD_LOCATION = gql`
  mutation AddLocation(
    $floorId: ID!
    $name: String!
    $occupancy: OccupancyStatus!
    $locationType: LocationType!
  ) {
    createLocation(
      floorId: $floorId
      name: $name
      occupancy: $occupancy
      locationType: $locationType
    ) {
      id
      name
      occupancy
      locationType
    }
  }
`;

export const ADD_SPOT = gql`
  mutation AddSpot($locationId: ID!, $name: String!) {
    createSpot(locationId: $locationId, name: $name) {
      id
      name
    }
  }
`;

export const GET_FLOOR = gql`
  query GetFloor($id: ID!) {
    floor(id: $id) {
      id
      name
      locations {
        id
        name
      }
    }
  }
`;

export const DELETE_LOCATION = gql`
  mutation DeleteLocation($locationId: ID!) {
    deleteLocation(locationId: $locationId)
  }
`;
