import { BookTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateUser } from "api/__generated__/server";
import MuiButton from "components/MuiButton";
import Page from "layout/Page";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthCookie from "utils/hooks/useAuthCookie";

const RegistrationPage = () => {
  const [registrationError, setRegistrationError] = useState<boolean>(false);
  const { addToken, addRefreshToken } = useAuthCookie();
  const navigate = useNavigate();
  const { mutate: register, isLoading } = useCreateUser({
    mutation: {
      onSuccess: ({ data }) => {
        addToken(data.token, "/");
        addRefreshToken(data.refreshToken);
        navigate("/stories");
      },
      onError: () => {
        setRegistrationError(true);
        setTimeout(() => {
          setRegistrationError(false);
        }, 5000);
      },
    },
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name")!.toString(),
      email: formData.get("email")!.toString(),
      password: formData.get("password")!.toString(),
    };
    register({ data });
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
          Create Your Adventure Account
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
            id="name"
            label="Name"
            name="name"
            autoFocus
            disabled={isLoading}
          />
          <TextField
            focused
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
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
            Register
          </MuiButton>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            disabled={isLoading}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Already have an account? Login.
          </Button>
        </Box>
        {registrationError && (
          <FormHelperText>
            Failed to register. Double check your entries and try again.
          </FormHelperText>
        )}
      </Box>
    </Page>
  );
};

export default RegistrationPage;
