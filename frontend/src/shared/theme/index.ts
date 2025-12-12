import { createTheme } from "@mui/material/styles";

// Shared palette settings
const sharedSettings = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

// Light theme
export const lightTheme = createTheme({
  ...sharedSettings,
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
    text: { primary: "#000000", secondary: "#555555" },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...sharedSettings,
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff", secondary: "#bbbbbb" },
  },
});
