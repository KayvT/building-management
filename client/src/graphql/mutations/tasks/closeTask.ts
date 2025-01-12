import { gql } from "@apollo/client";

export const CLOSE_TASK = gql`
  mutation CloseTask($taskId: ID!) {
    closeTask(taskId: $taskId) {
      id
    }
  }
`;
