import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { theme } from "theme";
import Router from "pages/Router";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { AuthorizationProvider } from "contexts/AuthorizationProvider";
const client = new QueryClient();

function App() {
  return (
    <CookiesProvider>
      <QueryClientProvider client={client}>
        <AuthorizationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </ThemeProvider>
        </AuthorizationProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
