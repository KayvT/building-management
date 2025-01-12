import { gql } from "@apollo/client";

export const ASSIGN_TASK = gql`
  mutation AssignTask($taskId: ID!, $operativeId: ID) {
    assignTask(taskId: $taskId, operativeId: $operativeId) {
      id
      operative {
        name
      }
    }
  }
`;

