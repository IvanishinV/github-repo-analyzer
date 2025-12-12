import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "../../shared/ui/PageContainer";
import { useRepository } from "../../features/repos/model/hooks/useFetchRepos";
import { RepositoryDetails } from "../../features/repos/ui/RepositoryDetails";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function RepoPage() {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();

  if (!name) {
    return (
      <PageContainer>
        <Typography color="error">Repository not specified.</Typography>
      </PageContainer>
    );
  }

  const fullName = decodeURIComponent(name);

  const { repo, loading, error } = useRepository(fullName);

  const errorMessage = repo?.error ?? (typeof error === "string" ? error : undefined);

  return (
    <PageContainer>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate("/")}>
        ← Back
      </Button>

      {loading ? (
        <Typography>Loading details…</Typography>
      ) : errorMessage ? (
        <Typography color="error">{errorMessage}</Typography>
      ) : repo?.data ? (
        <RepositoryDetails details={repo} />
      ) : (
        <Typography>No repository details available.</Typography>
      )}
    </PageContainer>
  );
}
