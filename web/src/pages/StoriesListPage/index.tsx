import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useListStories } from "api/__generated__/server";
import Page from "layout/Page";
import { useNavigate } from "react-router-dom";

const StoriesListPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useListStories();

  return (
    <Page>
      <Box>
        {isLoading && <CircularProgress />}
        {!isLoading &&
          data?.data.map((story) => {
            return (
              <Button
                variant="contained"
                sx={{ my: 2, display: "block" }}
                onClick={() => navigate(`/stories/${story.id}`)}
              >
                <Typography variant="h3">{story.title}</Typography>
                <Typography variant="caption">
                  Created: {new Date(story.createdAt).toDateString()}
                </Typography>
              </Button>
            );
          })}
      </Box>
    </Page>
  );
};

export default StoriesListPage;
