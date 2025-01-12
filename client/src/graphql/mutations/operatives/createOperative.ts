import { gql } from "@apollo/client";

export const CREATE_OPERATIVE = gql`
  mutation AddOperative($name: String!, $code: String!, $isHuman: Boolean!) {
    createOperative(name: $name, code: $code, isHuman: $isHuman) {
      id
    }
  }
`;
