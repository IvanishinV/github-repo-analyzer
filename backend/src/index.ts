import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./schema.js";
import { resolvers, type RepoResult } from "./resolvers/repoResolvers.js";
import { ENV } from "./config/env.js";

async function analyzeEnvRepos() {
  if (!ENV.GITHUB_TOKEN || !ENV.REPO_LIST.length) return;

  console.log(`Starting initial analysis of ${ENV.REPO_LIST.length} repos from ENV`);

  try {
    const results: RepoResult[] = await resolvers.Query.repositories({}, { repoFullNames: ENV.REPO_LIST, token: ENV.GITHUB_TOKEN });
    
    results.forEach((r) => {
      if ("data" in r) {
        console.log(`✅ Initial scan succeeded for ${r.fullName}`);
      } else {
        console.error(`❌ Initial scan failed for ${r.fullName}: ${r.error}`);
      }
    });
  } catch (err) {
    console.error(`❌ Initial scan failed:`, (err as Error).message);
  }

  console.log(`Initial ENV repo scan finished.`);
}

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const port = Number(process.env.PORT || 4000);

  const { url } = await startStandaloneServer(server, {
    listen: { port }
  });

  console.log(`🚀 Server ready at ${url}`);
  console.log(`Using initial token: ${ENV.GITHUB_TOKEN ? "yes. Few repos will be analyzed" : "no. None repos will be analyzed"}`);

  analyzeEnvRepos();
}

start().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
