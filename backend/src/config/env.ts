import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

const EnvSchema = z.object({
  GITHUB_TOKEN: z.string().optional(),
  REPO_LIST: z.string().optional(),
  CACHE_TTL_SECONDS: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : undefined))
    .pipe(z.number().int().positive().optional())
}).refine(
  (data) => {
    const hasToken = !!data.GITHUB_TOKEN;
    const hasRepos = !!data.REPO_LIST;

    return (hasToken && hasRepos) || (!hasToken && !hasRepos);
  },
  {
    message: "GITHUB_TOKEN and REPO_LIST must be set together or both omitted",
    path: ["GITHUB_TOKEN", "REPO_LIST"]
  }
);

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.treeifyError(parsed.error));
  process.exit(1);
}

const TTL_ONE_MINUTE = 60;

export const ENV = {
  GITHUB_TOKEN: parsed.data.GITHUB_TOKEN,
  REPO_LIST: parsed.data.REPO_LIST
    ? parsed.data.REPO_LIST.split(",").map(s => s.trim()).filter(Boolean)
    : [],
  CACHE_TTL_SECONDS: parsed.data.CACHE_TTL_SECONDS ? Number(parsed.data.CACHE_TTL_SECONDS) : TTL_ONE_MINUTE
} as const;
