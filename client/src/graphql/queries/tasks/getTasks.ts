import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query GetTasks($filter: TaskFilterInput!) {
    tasks(filter: $filter) {
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
