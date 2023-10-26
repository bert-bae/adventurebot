import { Box } from "@mui/material";
import { ReactNode } from "react";

interface IPageLayoutProps {
  mobile: boolean;
  children: ReactNode[];
}

const PageLayout: React.FC<IPageLayoutProps> = ({ mobile, children }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      flexDirection={mobile ? "column" : "row"}
      sx={{ mt: 12, mb: 12 }}
    >
      {children}
    </Box>
  );
};

export default PageLayout;
