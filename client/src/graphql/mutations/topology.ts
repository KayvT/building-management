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
        occupancy
        spots {
          id
        }
      }
    }
  }
`;

export const DELETE_LOCATION = gql`
  mutation DeleteLocation($locationId: ID!) {
    deleteLocation(locationId: $locationId)
  }
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateLocation($locationId: ID!, $data: UpdateLocationInput!) {
    updateLocation(locationId: $locationId, data: $data) {
      id
      name
      occupancy
      locationType
    }
  }
`;

export const UPDATE_FLOOR = gql`
  mutation UpdateFloor($floorId: ID!, $data: UpdateFloorInput!) {
    updateFloor(floorId: $floorId, data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_SPOT = gql`
  mutation UpdateSpot($spotId: ID!, $data: UpdateSpotInput!) {
    updateSpot(spotId: $spotId, data: $data) {
      id
      name
    }
  }
`;
