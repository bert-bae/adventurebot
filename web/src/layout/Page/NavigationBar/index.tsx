import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "contexts/AuthorizationProvider";

type NavigationBarProps = {};

const StyledAppBar = styled(AppBar)`
  background-color: transparent;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows[0]};
`;

const NavigationBar: React.FC<NavigationBarProps> = () => {
  const { state, removeToken } = useAuthContext();
  const navigate = useNavigate();

  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ width: "100%", margin: "0 auto" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h2">Bertcode | AdventureBot</Typography>
        </Box>
        {!state.user.id && (
          <Button variant="outlined" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
        {!!state.user.id && (
          <Button
            variant="outlined"
            onClick={() => {
              removeToken();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavigationBar;
