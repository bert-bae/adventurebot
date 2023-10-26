import { Typography, Link } from "@mui/material";

const Copyright = () => {
  return (
    <Typography variant="body2" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Bertcode
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;
