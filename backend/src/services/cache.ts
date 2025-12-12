import type { RepoResult } from "./types.js";

/**
 * In-memory caches:
 * - repoDataCache: caches successful RepositoryDetails
 * - repoResultCache: caches RepoResult entries
 */
type CacheEntry<T> = { value: T; expiresAt: number };

const repoDataCache = new Map<string, CacheEntry<any>>();
const repoResultCache = new Map<string, CacheEntry<any>>();

function nowMs() { return Date.now(); }

export function getCache<T>(map: Map<string, CacheEntry<any>>, key: string): T | null {
  const e = map.get(key);
  if (!e) return null;
  if (nowMs() > e.expiresAt) {
    map.delete(key);
    return null;
  }
  return e.value as T;
}

export function setCache<T>(map: Map<string, CacheEntry<any>>, key: string, value: T, ttlMs: number) {
  map.set(key, { value, expiresAt: nowMs() + ttlMs });
}

/**
 * Functions for repoDataCache (RepositoryDetails entries)
 */
export function getRepoDataCache<T>(key: string): T | null {
  return getCache<T>(repoDataCache, key);
}
export function setRepoDataCache<T>(key: string, value: T, ttlMs: number) {
  setCache(repoDataCache, key, value, ttlMs);
}

/**
 * Functions for repoResultCache (RepoResult entries)
 */
export function getCachedResult(key: string): RepoResult | null {
  return getCache<RepoResult>(repoResultCache, key);
}

export function setCachedResult(key: string, value: RepoResult, ttlMs: number) {
  setCache(repoResultCache, key, value, ttlMs);
}

/**
 * Return all non-expired RepoResult entries from repoResultCache
 */
export function getAllCachedResults(): RepoResult[] {
  const now = nowMs();
  const result: RepoResult[] = [];

  for (const [key, entry] of repoResultCache.entries()) {
    if (entry.expiresAt > now) {
      result.push(entry.value as RepoResult);
    } else {
      repoResultCache.delete(key);
    }
  }

  return result;
}

/**
 * Return RepoResult and RepositoryDetails from both caches
 */
export function removeRepo(fullName: string): boolean {
  let removed = false;

  if (repoResultCache.has(fullName)) {
    repoResultCache.delete(fullName);
    removed = true;
  }

  if (repoDataCache.has(fullName)) {
    repoDataCache.delete(fullName);
    removed = true;
  }

  return removed;
}
