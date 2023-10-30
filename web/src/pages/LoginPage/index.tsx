import { BookTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useLogin } from "api/__generated__/server";
import MuiButton from "components/MuiButton";
import { useAuthContext } from "contexts/AuthorizationProvider";
import Page from "layout/Page";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loginError, setLoginError] = useState<boolean>(false);
  const { addToken, addRefreshToken } = useAuthContext();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useLogin({
    mutation: {
      onSuccess: ({ data }) => {
        addToken(data.token, "/");
        addRefreshToken(data.refreshToken);
        navigate("/stories");
      },
      onError: () => {
        setLoginError(true);
        setTimeout(() => {
          setLoginError(false);
        }, 5000);
      },
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email")!.toString(),
      password: formData.get("password")!.toString(),
    };
    login({ data });
  };

  return (
    <Page>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <BookTwoTone />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ my: 2, maxWidth: "500px" }}
        >
          <TextField
            focused
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            disabled={isLoading}
          />
          <TextField
            focused
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            disabled={isLoading}
          />
          <MuiButton
            type="submit"
            fullWidth
            variant="contained"
            loading={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </MuiButton>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            disabled={isLoading}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Don't have an account? Register.
          </Button>
        </Box>
        {loginError && (
          <FormHelperText>
            Failed to login. Double check your credentials and try again.
          </FormHelperText>
        )}
      </Box>
    </Page>
  );
};

export default LoginPage;
