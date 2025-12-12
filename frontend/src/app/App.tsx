import { BrowserRouter } from "react-router-dom";
import { Header } from "../shared/ui/Header";
import { AppRouter } from "./providers/router";

export interface AppProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function App({ isDarkMode, toggleDarkMode }: AppProps) {
  return (
    <BrowserRouter>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <AppRouter />
    </BrowserRouter>
  );
}
