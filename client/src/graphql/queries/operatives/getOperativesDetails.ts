import { gql } from "@apollo/client";

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
