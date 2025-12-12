import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { RepoResult } from "../../../shared/types/repo";
import { useState } from "react";

interface RepositoryListItemProps {
  repo: RepoResult;
  isNew: boolean;
  onDetails: (fullName: string) => void;
  onRemove: (fullName: string) => Promise<void>;
}

export function RepositoryListItem({
  repo,
  isNew,
  onDetails,
  onRemove,
}: RepositoryListItemProps) {
  const hasError = !!repo.error;
  const hasData = !!repo.data;
  const [removing, setRemoving] = useState(false);

  const handleRemoveClick = async () => {
    setRemoving(true);
    try {
      await onRemove(repo.fullName);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 1,
      p: 1.5,
      borderRadius: 1,
      backgroundColor: isNew
        ? "rgba(25, 118, 210, 0.28)"
        : "rgba(25, 118, 210, 0.08)",
      transition: "background-color 0.5s",
    }}
    >
      {/* Left: Repo full name and size */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="body1" fontWeight="bold">
          {repo.fullName}
        </Typography>

        {hasData && (
          <Typography variant="body2" color="text.secondary" noWrap>
            size: {repo.data?.size ?? "-"} KB
          </Typography>
        )}
      </Box>

      {/* Right: "Details" button/error, and "Remove" buttons */}
      <Box sx={{
        flexShrink: 0,
        display: "flex",
        gap: 1
      }}>

        {/* "Details" button */}
        {hasData && (
          <Button
            variant={isNew ? "contained" : "outlined"}
            color={isNew ? "primary" : "inherit"}
            onClick={() => onDetails(repo.fullName)}
          >
            Details
          </Button>
        )}

        {/* Repo error if there was such */}
        {hasError && (
          <Box sx={{
            p: "6px 12px",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "error.main",
            textAlign: "center",
          }}
          >
            <Typography variant="body2" color="error" noWrap>
              {repo.error}
            </Typography>
          </Box>
        )}

        {/* "Remove" button is always shown */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleRemoveClick}
          disabled={removing}
        >
          {removing ? "Removing…" : "Remove"}
        </Button>
      </Box>
    </Box>
  );
}
