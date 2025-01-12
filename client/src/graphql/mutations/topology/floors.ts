import { gql } from "@apollo/client";

export const ADD_FLOOR = gql`
  mutation AddFloor($name: String!) {
    createFloor(name: $name) {
      id
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

export const DELETE_FLOOR = gql`
  mutation DeleteFloor($floorId: ID!) {
    deleteFloor(floorId: $floorId)
  }
`;
