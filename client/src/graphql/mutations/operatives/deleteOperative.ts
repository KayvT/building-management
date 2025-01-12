import { gql } from "@apollo/client";

export const DELETE_OPERATIVE = gql`
  mutation DeleteOperative($operativeId: ID!) {
    deleteOperative(operativeId: $operativeId)
  }
`;
