import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useListStories, useStartStory } from "api/__generated__/server";
import MuiButton from "components/MuiButton";
import Page from "layout/Page";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const StoriesListPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useListStories();

  const { mutate: start, isLoading: isCreating } = useStartStory({
    mutation: {
      onSuccess: ({ data }) => {
        navigate(`/stories/${data.id}`);
      },
    },
  });

  const startStory = useCallback(() => {
    start({
      data: {
        title: "Test Title",
        story: "Story about a building that never stops growing.",
      },
    });
  }, []);

  return (
    <Page>
      <Box sx={{ py: 4 }}>
        <Box display="flex">
          <Typography variant="h2">Your Stories</Typography>
          <MuiButton
            sx={{ ml: 2 }}
            variant="contained"
            onClick={startStory}
            loading={isCreating}
          >
            New Story
          </MuiButton>
        </Box>
        {isLoading && <CircularProgress />}
        {!isLoading &&
          data?.data.map((story) => {
            return (
              <Button
                variant="outlined"
                sx={{ my: 2, display: "block" }}
                fullWidth
                onClick={() => navigate(`/stories/${story.id}`)}
              >
                <Typography variant="h4">{story.title}</Typography>
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
