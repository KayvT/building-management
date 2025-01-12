import { gql } from "@apollo/client";

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      location {
        name
        id
      }
      state
      createdAt
      dueAt
      priority
      operative {
        id
        name
      }
    }
  }
`;
