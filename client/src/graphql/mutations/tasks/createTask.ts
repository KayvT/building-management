import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask(
    $locationId: ID!
    $state: TaskState!
    $createdAt: String!
    $dueAt: String!
    $priority: PriorityLevel!
    $operativeId: ID!
  ) {
    createTask(
      locationId: $locationId
      state: $state
      createdAt: $createdAt
      dueAt: $dueAt
      priority: $priority
      operativeId: $operativeId
    ) {
      id
    }
  }
`;
