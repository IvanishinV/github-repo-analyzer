import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  onAnalyze: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export function RepoActions({ onAnalyze, onRefresh, loading }: Props) {
  return (
    <>
      <Button
        variant="contained"
        onClick={onAnalyze}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        Analyze New Repositories
      </Button>

      <Button variant="outlined" onClick={onRefresh}>
        Refresh Cached Repositories
      </Button>
    </>
  );
}
