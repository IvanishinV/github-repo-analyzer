import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../../shared/theme";

export const ThemeProviderWrapper: React.FC<{
  isDarkMode: boolean;
  children?: React.ReactNode;
}> = ({ isDarkMode, children }) => {
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
