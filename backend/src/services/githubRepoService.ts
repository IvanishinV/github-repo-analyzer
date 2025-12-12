import fetch from "node-fetch";

const GITHUB_API = "https://api.github.com";

export type RepoMeta = {
  name: string;
  full_name: string;
  size: number;
  private: boolean;
  owner: { login: string };
  default_branch?: string;
};

export async function githubGet<T = any>(path: string, token: string) {
  const url = path.startsWith("http") ? path : `${GITHUB_API}${path}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "github-repo-analyzer"
  };
  if (token) headers["Authorization"] = `token ${token}`;

  const res = await fetch(url, { headers });
  const text = await res.text();

  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`GitHub returned non-JSON response for ${url}: ${text}`);
  }

  if (!res.ok) {
    const message = json && json.message ? json.message : res.statusText;
    throw new Error(`GitHub API error ${res.status} ${res.statusText}: ${message}`);
  }
  return json as T;
}

/**
 * Fetch basic repo metadata
 */
export async function fetchRepoMeta(fullName: string, token: string) {
  return githubGet<RepoMeta>(`/repos/${fullName}`, token);
}

/**
 * Fetch git tree recursively for default branch to count files and find yml files
 */
export async function fetchRepoTree(fullName: string, branch: string, token: string) {
  const encodedBranch = encodeURIComponent(branch);
  return githubGet(`/repos/${fullName}/git/trees/${encodedBranch}?recursive=1`, token);
}

/**
 * Fetch file contents via contents endpoint (utf-8)
 */
export async function fetchFileContent(fullName: string, path: string, token: string) {
  const resp = await githubGet(`/repos/${fullName}/contents/${encodeURIComponent(path)}`, token) as any;
  if (!resp || !resp.content) return null;

  const buff = Buffer.from(resp.content, resp.encoding || "base64");
  return buff.toString("utf8");
}

/**
 * Fetch webhooks for repo (may require token with permissions)
 */
export async function fetchWebhooks(fullName: string, token: string) {
  return githubGet(`/repos/${fullName}/hooks`, token);
}
