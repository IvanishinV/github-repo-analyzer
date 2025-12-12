import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { RepoResult } from "../../../shared/types/repo";

export function RepositoryDetails({ details }: { details: RepoResult | null }) {
  if (!details) {
    return <Typography color="error">No details available.</Typography>;
  }

  if (details.error) {
    return <Typography color="error">{details.error}</Typography>;
  }

  if (!details.data) {
    return <Typography color="error">No repository data available.</Typography>;
  }

  const repo = details.data;

  const emptyBoxStyle = {
    p: 2,
    background: "#f6f6f6",
    borderRadius: 1,
    fontSize: "0.875rem",
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 2, p: 1 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {repo.owner}/{repo.name}
        </Typography>

        {/* Base repo info */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <Chip label={`Name: ${repo.name}`} />
          <Chip label={`Size: ${repo.size} KB`} />
          <Chip label={`Owner: ${repo.owner}`} />
          <Chip label={`Visibility: ${repo.visibility}`} />
          <Chip label={`Files: ${repo.numberOfFiles}`} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* First found yaml file */}
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Sample YAML {repo.sampleYmlPath ? `(${repo.sampleYmlPath})` : ""}
        </Typography>
        {repo.sampleYmlPath ? (
          <SyntaxHighlighter
            language="yaml"
            style={oneLight}
            customStyle={{ ...emptyBoxStyle, overflowX: "auto" }}
          >
            {repo.sampleYmlContent ?? "<failed to load YAML content>"}
          </SyntaxHighlighter>
        ) : (
          <Box sx={emptyBoxStyle}>No YAML files found</Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* All found web hooks */}
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Active Webhooks
        </Typography>
        {repo.activeWebhooks.length === 0 ? (
          <Box sx={emptyBoxStyle}>No active webhooks</Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {repo.activeWebhooks.map((h) => (
              <Box
                key={h.id}
                sx={{
                  p: 1,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography fontSize="0.875rem" fontWeight="medium">
                  {h.url ?? "<no URL>"}
                </Typography>
                <Typography fontSize="0.75rem" color="text.secondary">
                  Events: {h.events.join(", ")} | Active: {h.active ? "Yes" : "No"}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
