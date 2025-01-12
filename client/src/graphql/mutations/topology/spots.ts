import { gql } from "@apollo/client";

export const ADD_SPOT = gql`
  mutation AddSpot($locationId: ID!, $name: String!) {
    createSpot(locationId: $locationId, name: $name) {
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



export const DELETE_SPOT = gql`
  mutation DeleteSpot($spotId: ID!) {
    deleteSpot(spotId: $spotId)
  }
`;