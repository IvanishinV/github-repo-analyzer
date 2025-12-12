import { gql } from "@apollo/client";

export const GET_CACHED_REPOSITORIES = gql`
  query GetCachedRepositories {
    cachedRepositories {
      fullName
      data {
        name
        owner
        size
        visibility
        numberOfFiles
        sampleYmlPath
        sampleYmlContent
        activeWebhooks {
          id
          url
          events
          active
        }
      }
      error
    }
  }
`;

export const GET_REPOSITORIES = gql`
  query GetRepositories($repoFullNames: [String!]!, $token: String!) {
    repositories(repoFullNames: $repoFullNames, token: $token) {
      fullName
      data {
        name
        owner
        size
        visibility
        numberOfFiles
        sampleYmlPath
        sampleYmlContent
        activeWebhooks {
          id
          url
          events
          active
        }
      }
      error
    }
  }
`;

export const GET_REPOSITORY_DETAILS = gql`
  query GetRepositoryDetails($repoFullName: String!) {
    repositoryDetails(repoFullName: $repoFullName) {
      fullName
      data {
        name
        owner
        size
        visibility
        numberOfFiles
        sampleYmlPath
        sampleYmlContent
        activeWebhooks {
          id
          url
          events
          active
        }
      }
      error
    }
  }
`;
