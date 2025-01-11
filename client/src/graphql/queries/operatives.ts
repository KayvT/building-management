import { gql } from "@apollo/client";

export const GET_OPERATIVES = gql`
  query GetOperatives {
    tenant {
      operatives {
        name
        id
      }
    }
  }
`;
export const GET_OPERATIVES_DETAILS = gql`
  query GetOperativesDetails {
    tenant {
      operatives {
        name
        id
        code
        isHuman
      }
    }
  }
`;
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

export const DELETE_OPERATIVE = gql`
  mutation DeleteOperative($operativeId: ID!) {
    deleteOperative(operativeId: $operativeId)
  }
`;

export const ADD_OPERATIVE = gql`
  mutation AddOperative($name: String!, $code: String!, $isHuman: Boolean!) {
    createOperative(name: $name, code: $code, isHuman: $isHuman) {
      id
    }
  }
`;
