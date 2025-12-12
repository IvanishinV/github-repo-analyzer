import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./app/providers/apollo";
import { ThemeProviderWrapper } from "./app/providers/theme";
import App from "./app/App";

import "./index.module.css";

function Root() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode((p) => !p);

  return (
    <AppProviders>
      <ThemeProviderWrapper isDarkMode={isDarkMode}>
        <App isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </ThemeProviderWrapper>
    </AppProviders>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
