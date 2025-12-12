import { useQuery } from "@apollo/client/react";
import { GET_REPOSITORIES } from "../../../../shared/api/graphql/queries";
import type { RepositoryDetails } from "../../../../shared/types/repo";
import { useRepoStore } from "../store/useRepoStore";

export function useRepoDetails(fullName: string) {
  const token = useRepoStore((s) => s.token);

  const { data, loading, error } = useQuery<{ repositories: RepositoryDetails[] }>(
    GET_REPOSITORIES,
    {
      variables: {
        repoFullNames: [fullName],
        token: token || undefined,
      },
      skip: !token,
      fetchPolicy: "cache-first",
    }
  );

  return {
    details: data?.repositories?.[0] ?? null,
    loading,
    error,
  };
}
