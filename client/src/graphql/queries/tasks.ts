import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
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
