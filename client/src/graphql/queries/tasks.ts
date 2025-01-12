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

export const ASSIGN_TASK = gql`
  mutation AssignTask($taskId: ID!, $operativeId: ID) {
    assignTask(taskId: $taskId, operativeId: $operativeId) {
      id
    }
  }
`;

export const CLOSE_TASK = gql`
  mutation CloseTask($taskId: ID!) {
    closeTask(taskId: $taskId) {
      id
    }
  }
`;
