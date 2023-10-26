import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";

type NavigationBarProps = {};

const StyledAppBar = styled(AppBar)`
  background-color: transparent;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows[0]};
`;

const NavigationBar: React.FC<NavigationBarProps> = () => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ width: "100%", margin: "0 auto" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h2">Bertcode | AdventureBot</Typography>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavigationBar;
