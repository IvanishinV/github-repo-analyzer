export function parseRepoList(text: string): string[] {
  return text
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
}
