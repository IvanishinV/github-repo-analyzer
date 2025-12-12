import { useState } from "react";
import Alert from "@mui/material/Alert";
import type { RepoResult } from "../../../shared/types/repo";
import { RepositoryListItem } from "./RepositoryListItem";

export interface RemoveResult {
  ok: boolean;
  error?: string;
}

interface RepositoryListProps {
  repos: RepoResult[];
  newlyAddedFullNames: string[];
  onDetails: (fullName: string) => void;
  onRemove: (fullName: string) => Promise<RemoveResult>;
}

export function RepositoryList({
  repos,
  newlyAddedFullNames,
  onDetails,
  onRemove,
}: RepositoryListProps) {
  const [removeError, setRemoveError] = useState<string | null>(null);

  const handleRemove = async (fullName: string) => {
    setRemoveError(null);

    const result = await onRemove(fullName);

    if (!result.ok) {
      setRemoveError(result.error ?? "Failed to remove repository");
    }
  };

  return (
    <>
      {removeError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {removeError}
        </Alert>
      )}

      {repos.map((repo) => (
        <RepositoryListItem
          key={repo.fullName}
          repo={repo}
          isNew={newlyAddedFullNames.includes(repo.fullName)}
          onDetails={onDetails}
          onRemove={handleRemove}
        />
      ))}
    </>
  );
}
