import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { theme } from "theme";
import Router from "pages/Router";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { AuthorizationProvider } from "contexts/AuthorizationProvider";
import { NotificationProvider } from "contexts/NotificationProvider";
const client = new QueryClient();

function App() {
  return (
    <CookiesProvider>
      <QueryClientProvider client={client}>
        <AuthorizationProvider>
          <NotificationProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </ThemeProvider>
          </NotificationProvider>
        </AuthorizationProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
