import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import {
  GET_CACHED_REPOSITORIES,
  GET_REPOSITORIES,
  GET_REPOSITORY_DETAILS,
} from "../../../../shared/api/graphql/queries";
import type { RepoResult, RepositoryDetails } from "../../../../shared/types/repo";
import { useRepoStore } from "../store/useRepoStore";

export function useCachedRepositories() {
  const setReposFromCache = useRepoStore((s) => s.setReposFromCache);

  const { data, loading, error, refetch } = useQuery<{ cachedRepositories: RepositoryDetails[] }>(
    GET_CACHED_REPOSITORIES,
    { fetchPolicy: "network-only" }
  );

  useEffect(() => {
    if (data?.cachedRepositories?.length) {
      setReposFromCache(data.cachedRepositories);
    }
  }, [data, setReposFromCache]);

  return { data, loading, error, refetchCached: refetch };
}

export function useRepositoriesLazy() {
  const [fetchRepos, { data, loading, error }] = useLazyQuery<{ repositories: RepoResult[] }>(
    GET_REPOSITORIES,
    { fetchPolicy: "network-only" }
  );
  return {
    fetchRepos,
    repos: data?.repositories ?? [],
    loading,
    error,
  };
}

export function useRepository(fullName: string) {
  const { data, loading, error } = useQuery<{ repositoryDetails: RepoResult }>(
    GET_REPOSITORY_DETAILS,
    {
      variables: { repoFullName: fullName },
      skip: !fullName,
      fetchPolicy: "network-only",
    }
  );

  const repo: RepoResult | null = data?.repositoryDetails
    ? {
        fullName: data.repositoryDetails.fullName,
        data: data.repositoryDetails.data ?? null,
        error: data.repositoryDetails.error ?? null,
      }
    : null;

  return { repo, loading, error };
}
