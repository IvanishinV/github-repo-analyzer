import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { PageContainer } from "../../shared/ui/PageContainer";
import type { RepoResult } from "../../shared/types/repo";

import { RepositoryList } from "../../features/repos/ui/RepositoryList";
import { RepoInputForm } from "../../features/repos/ui/RepoInputForm";
import { RepoActions } from "../../features/repos/ui/RepoActions";

import { useRepoStore } from "../../features/repos/model/store/useRepoStore";
import { useCachedRepositories, useRepositoriesLazy } from "../../features/repos/model/hooks/useFetchRepos";
import { useRemoveRepository } from "../../features/repos/model/hooks/useRemoveRepository";
import { useLocalStorageBoolean } from "../../features/repos/model/hooks/useLocalStorageBoolean";
import { parseRepoList } from "../../features/repos/lib/parseReposList";

export default function HomePage() {
  const navigate = useNavigate();

  const { token, setToken, repos, order, setRepo } = useRepoStore();

  const [repoListText, setRepoListText] = useState("");
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useLocalStorageBoolean("repos:autoRefresh", true);

  const { refetchCached } = useCachedRepositories();
  const { fetchRepos, repos: fetchedRepos, loading, error } =
    useRepositoriesLazy();
  const { removeRepo } = useRemoveRepository();

  // Update repos from backend automatically every 5 seconds
  useEffect(() => {
    if (!autoRefresh || !refetchCached) return;

    const interval = setInterval(() => {
      if (!document.hidden) {
        refetchCached();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchCached]);

  // Apply fetched repositories
  useEffect(() => {
    if (fetchedRepos.length === 0) return;

    fetchedRepos.forEach(setRepo);
    setHighlighted(fetchedRepos.map((r) => r.fullName));

    const timer = setTimeout(() => setHighlighted([]), 3000);
    return () => clearTimeout(timer);
  }, [fetchedRepos, setRepo]);

  const handleAnalyze = () => {
    if (!token) return;

    const parsed = parseRepoList(repoListText);
    const toFetch = parsed.filter((name) => !repos[name]);

    if (toFetch.length === 0) return;

    fetchRepos({
      variables: {
        repoFullNames: toFetch,
        token,
      },
    });
  };

  const displayedRepos = useMemo(
    () =>
      order
        .map((name) => repos[name])
        .filter((r): r is RepoResult => r !== undefined),
    [order, repos]
  );

  return (
    <PageContainer>
      <Typography variant="h4" sx={{ mb: 2 }}>
        GitHub Repository Analyzer
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <RepoInputForm
          token={token}
          onTokenChange={setToken}
          repoListText={repoListText}
          onRepoListChange={setRepoListText}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <RepoActions
            onAnalyze={handleAnalyze}
            onRefresh={() => refetchCached?.()}
            loading={loading}
          />

          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            }
            label="Auto refresh"
          />
        </Box>
      </Box>

      {loading && <CircularProgress />}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}

      <RepositoryList
        repos={displayedRepos}
        newlyAddedFullNames={highlighted}
        onDetails={(fullName) =>
          navigate(`/repo/${encodeURIComponent(fullName)}`)
        }
        onRemove={removeRepo}
      />
    </PageContainer>
  );
}
