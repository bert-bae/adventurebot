import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
} from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { theme } from "theme";
import Router from "pages/Router";
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { AuthorizationProvider } from "contexts/AuthorizationProvider";
import { NotificationProvider } from "contexts/NotificationProvider";
import useAuthCookie from "utils/hooks/useAuthCookie";

const QueryClientProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { removeToken } = useAuthCookie();
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (err: any) => {
        if (err?.response?.data?.code === "AuthorizationExpired") {
          removeToken();
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 5000,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

function App() {
  return (
    <CookiesProvider>
      <QueryClientProviderWrapper>
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
      </QueryClientProviderWrapper>
    </CookiesProvider>
  );
}

export default App;
