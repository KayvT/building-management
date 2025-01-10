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
