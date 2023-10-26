import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { theme } from "theme";
import StoryPage from "pages/StoryPage";
const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoryPage />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
