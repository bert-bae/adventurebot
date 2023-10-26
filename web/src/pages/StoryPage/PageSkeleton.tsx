import { useTheme } from "@emotion/react";
import { Skeleton, Box } from "@mui/material";
import PageLayout from "./PageLayout";

interface IPageSkeletonProps {
  mobile: boolean;
}
const PageSkeleton = ({ mobile }: IPageSkeletonProps) => {
  const theme = useTheme();
  return (
    <PageLayout mobile={mobile}>
      <Skeleton
        variant="rectangular"
        sx={{
          height: theme.spacing(60),
          width: theme.spacing(60),
          borderRadius: "12px",
          mb: mobile ? 6 : 0,
        }}
      />
      <Box display="flex" flexDirection="column" alignItems="center">
        <Skeleton height="32px" width="250px" />
        <Skeleton height="32px" width="300px" />
        <Skeleton height="32px" width="250px" />
      </Box>
    </PageLayout>
  );
};

export default PageSkeleton;
