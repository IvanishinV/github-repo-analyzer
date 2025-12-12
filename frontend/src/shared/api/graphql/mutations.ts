import { gql } from "@apollo/client";

export const REMOVE_REPOSITORY = gql`
  mutation RemoveRepository($fullName: String!) {
    removeRepository(fullName: $fullName) {
      success
      error
    }
  }
`;
