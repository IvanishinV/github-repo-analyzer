import { createLimiter, LIMIT_NUMBER } from "../utils/concurrency.js";
import { ENV } from "../config/env.js";
import type { RepoResult } from "../services/types.js";
import { scanRepo } from "../services/scanRepo.js";
import { getAllCachedResults, getCachedResult, removeRepo, setCachedResult } from "../services/cache.js";

const limit = createLimiter(LIMIT_NUMBER);

async function analyzeSingleRepo(repoFullName: string, token: string): Promise<RepoResult> {
  if (!token) throw new Error("GitHub token is required");
  if (!repoFullName) throw new Error("repoFullName is required");

  const cacheKey = repoFullName;
  const ttlMs = ENV.CACHE_TTL_SECONDS * 1000;

  try {
    const data = await limit(() => scanRepo(repoFullName, token, ttlMs));

    const record: RepoResult = { fullName: repoFullName, data };
    setCachedResult(cacheKey, record, ttlMs);

    return record;
  } catch (err) {
    const message = (err as Error).message || "Unknown error";

    const record: RepoResult = { fullName: repoFullName, error: message };
    setCachedResult(cacheKey, record, ttlMs);

    return record;
  }
}

export const resolvers = {
  Query: {
    /**
     * Return cached repository details
     */
    repositoryDetails: (_: any, args: { repoFullName: string }) => {
      const cached = getCachedResult(args.repoFullName);
      if (cached) return cached;

      return { fullName: args.repoFullName, error: "Repository not analyzed yet" };
    },

    /**
     * Analyze given array of repositories usign the specified token
     */
    repositories: async (_: any, args: { repoFullNames: string[]; token: string }) => {
      const { repoFullNames, token } = args;

      if (!token) throw new Error("GitHub token is required");
      if (!Array.isArray(repoFullNames) || repoFullNames.length === 0) {
        throw new Error("repoFullNames must be a non-empty array");
      }

      const tasks = repoFullNames.map((fullName) => analyzeSingleRepo(fullName, token));
      return Promise.all(tasks);
    },

    /**
     * Return all cached RepoResult entries (both successes and errors)
     */
    cachedRepositories: async (_: any, __: any) => {
      return getAllCachedResults();
    },
  },

  Mutation: {
    removeRepository: async (_: any, { fullName }: { fullName: string }) => {
      try {
        const removed = removeRepo(fullName);
        if (!removed) {
          return { success: false, error: "Repository not found or cannot be removed" };
        }

        return { success: true, error: null };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
  },
};

export type { RepoResult };
