import { create } from "zustand";
import type { RepoResult } from "../../../../shared/types/repo";

// Save only the last token since we get details only for fetched repos
// If needed, we can implement token map: string -> RepoResult[]
interface RepoStore {
  token: string;
  setToken: (token: string) => void;

  repos: Record<string, RepoResult>;
  order: string[];
  setRepo: (repo: RepoResult) => void;

  setReposFromCache: (reposArray: RepoResult[]) => void;
  removeRepo: (fullName: string) => void;
}

export const useRepoStore = create<RepoStore>((set) => ({
  token: "",
  setToken: (token) => set({ token }),

  repos: {},
  order: [],
  setRepo: (repo) =>
    set((state) => {
      const alreadyExists = !!state.repos[repo.fullName];
      const newOrder = alreadyExists ? state.order : [repo.fullName, ...state.order];
      return {
        repos: { ...state.repos, [repo.fullName]: repo },
        order: newOrder,
      };
    }),

  setReposFromCache: (reposArray) =>
    set((state) => {
      const newRepos = { ...state.repos };
      const newOrder = [...state.order];

      reposArray.forEach((repo) => {
        if (!newRepos[repo.fullName]) newOrder.push(repo.fullName);
        newRepos[repo.fullName] = repo;
      });

      return { repos: newRepos, order: newOrder };
    }),
    
  removeRepo: (fullName) =>
    set((state) => {
      const newRepos = { ...state.repos };
      delete newRepos[fullName];

      const newOrder = state.order.filter((name) => name !== fullName);

      return { repos: newRepos, order: newOrder };
    }),
}));
