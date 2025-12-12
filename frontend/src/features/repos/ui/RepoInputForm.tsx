import TextField from "@mui/material/TextField";

interface Props {
  token: string;
  onTokenChange: (v: string) => void;
  repoListText: string;
  onRepoListChange: (v: string) => void;
}

export function RepoInputForm({
  token,
  onTokenChange,
  repoListText,
  onRepoListChange,
}: Props) {
  return (
    <>
      <TextField
        label="GitHub Token"
        type="password"
        value={token}
        onChange={(e) => onTokenChange(e.target.value)}
        fullWidth
      />

      <TextField
        label="Repositories (one per line, e.g. user/repo)"
        multiline
        minRows={3}
        value={repoListText}
        onChange={(e) => onRepoListChange(e.target.value)}
        fullWidth
      />
    </>
  );
}
