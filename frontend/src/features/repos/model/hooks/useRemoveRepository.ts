import { useMutation } from "@apollo/client/react";
import { REMOVE_REPOSITORY } from "../../../../shared/api/graphql/mutations";
import { useRepoStore } from "../store/useRepoStore";

interface RemoveRepositoryResult {
  removeRepository: {
    success: boolean;
    error?: string | null;
  };
}

interface RemoveRepositoryVars {
  fullName: string;
}

export function useRemoveRepository() {
  const removeRepo = useRepoStore((s) => s.removeRepo);

  const [removeRepoMutation, { loading }] = useMutation<
    RemoveRepositoryResult,
    RemoveRepositoryVars
  >(REMOVE_REPOSITORY);

  const handleRemove = async (fullName: string) => {
    // const confirmed = window.confirm(`Are you sure you want to remove ${fullName} repo?`);
    // if (!confirmed) return;

    const { data } = await removeRepoMutation({ variables: { fullName } });

    if (!data?.removeRepository.success) {
      return {
        ok: false,
        error: data?.removeRepository.error ?? "Failed to remove repository",
      };
    }

    removeRepo(fullName);
    return { ok: true };
  };

  return { removeRepo: handleRemove, loading };
}
