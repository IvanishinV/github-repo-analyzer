import { ENV } from "../config/env.js";
import { getRepoDataCache, setRepoDataCache } from "./cache.js";
import { fetchFileContent, fetchRepoMeta, fetchRepoTree, fetchWebhooks } from "./githubRepoService.js";
import type { RepositoryDetails } from "./types.js";

export async function scanRepo(fullName: string, token: string, cacheTtlMs = ENV.CACHE_TTL_SECONDS * 1000): Promise<RepositoryDetails> {
  const cacheKey = fullName;
  const cached = getRepoDataCache<RepositoryDetails>(cacheKey);
  if (cached) return cached;

  // Meta info
  let meta;
  try {
    meta = await fetchRepoMeta(fullName, token);
  } catch (err) {
    throw new Error(`Failed to fetch metadata for ${fullName}: ${(err as Error).message}`);
  }

  const branch = meta.default_branch || "main";

  // Tree and files
  let tree: any[] = [];
  try {
    const treeResp = await fetchRepoTree(fullName, branch, token);
    tree = treeResp?.tree || [];
  } catch {
    tree = [];
  }

  const numberOfFiles = tree.filter((e: any) => e.type === "blob").length;

  // First yaml file
  const ymlEntry = tree.find(
    (e: any) => e.type === "blob" &&
      (e.path.endsWith(".yml") || e.path.endsWith(".yaml"))
  );

  let sampleYmlPath: string | null = ymlEntry?.path || null;
  let sampleYmlContent: string | null = null;

  if (sampleYmlPath) {
    try {
      sampleYmlContent = await fetchFileContent(fullName, sampleYmlPath, token);
    } catch {
      sampleYmlContent = null;
    }
  }

  // All webhooks
  let hooks: any[] = [];
  try {
    hooks = await fetchWebhooks(fullName, token);
  } catch {
    hooks = [];
  }

  const activeWebhooks = (hooks || []).map((h: any) => ({
    id: h.id,
    url: h.config?.url || null,
    events: h.events || [],
    active: !!h.active
  }));

  const result: RepositoryDetails = {
    fullName,
    name: meta.name,
    owner: meta.owner?.login ?? fullName.split("/")[0],
    size: meta.size ?? 0,
    visibility: meta.private ? "private" : "public",
    numberOfFiles,
    sampleYmlPath,
    sampleYmlContent,
    activeWebhooks
  };

  try {
    setRepoDataCache(cacheKey, result, cacheTtlMs);
  } catch {
    console.error("Couldn't save details info for:", result.fullName);
  }

  return result;
}
