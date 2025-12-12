import pLimit from "p-limit";

export const LIMIT_NUMBER = 2;

export function createLimiter(concurrency = LIMIT_NUMBER) {
  return pLimit(concurrency);
}
