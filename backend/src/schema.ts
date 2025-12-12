export const typeDefs = `#graphql
  type RepositoryBasic {
    fullName: String!
    name: String!
    owner: String!
    size: Int!
  }

  type Webhook {
    id: ID!
    url: String
    events: [String!]
    active: Boolean
  }

  type RepositoryDetails {
    fullName: String!
    name: String!
    owner: String!
    size: Int!
    visibility: String!
    numberOfFiles: Int!
    sampleYmlPath: String
    sampleYmlContent: String
    activeWebhooks: [Webhook!]!
  }

  type RepoResult {
    fullName: String!
    data: RepositoryDetails
    error: String
  }

  type Mutation {
    removeRepository(fullName: String!): RemoveRepoResult!
  }

  type RemoveRepoResult {
    success: Boolean!
    error: String
  }

  type Query {
    repositoryDetails(repoFullName: String!): RepoResult!
    repositories(repoFullNames: [String!]!, token: String!): [RepoResult!]!
    cachedRepositories: [RepoResult!]!
  }
`;
