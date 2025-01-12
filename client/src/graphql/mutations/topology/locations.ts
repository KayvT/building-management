import { gql } from "@apollo/client";

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
