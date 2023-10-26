import Page from "layout/Page";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  Grid,
  Skeleton,
} from "@mui/material";
import FadeIn from "components/animated/FadeIn";
import { useDecision, useStartStory } from "api/__generated__/server";
import { LAYOUT_SIZES } from "theme";

// import { useWebsocket } from "utils/hooks/useWebsocket";
// const websocket = useWebsocket(`ws://localhost:5001`);

const MAX_DECISION_LENGTH = 160;
const MainPage = () => {
  const [storyId, setStoryId] = useState<string>("");
  const [story, setStory] = useState<{ story?: string; choice?: string }[]>([]);
  const [choices, setChoices] = useState<
    {
      type: "active" | "passive" | "neutral";
      content: string;
    }[]
  >([]);
  const [decisionInput, setDecisionInput] = useState<string>("");
  const { mutate: start, isLoading } = useStartStory({
    mutation: {
      onSuccess: ({ data }) => {
        setStoryId(data.id);
        setStory((prev) => [...prev, { story: data.story }]);
        setChoices(data.choices);
      },
    },
  });

  const { mutate: decide, isLoading: isDecisionLoading } = useDecision({
    mutation: {
      onSuccess: ({ data }) => {
        setStory((prev) => [...prev, { story: data.story }]);
        setChoices(data.choices);
      },
    },
  });

  const startStory = useCallback(() => {
    start({
      data: {
        title: "Test Title",
        email: "foo@bar.com",
        author: "Foo Bar",
        story: "Story about a building that never stops growing.",
      },
    });
  }, []);

  const makeDecision = useCallback(
    (choice: string) => {
      if (!storyId) {
        return;
      }
      decide({
        data: {
          id: storyId,
          decision: choice,
        },
      });
      setStory((prev) => [...prev, { choice }]);
      setDecisionInput("");
    },
    [storyId]
  );

  return (
    <Page>
      {!story.length && (
        <FadeIn>
          <Box>
            <Button onClick={startStory} disabled={isLoading}>
              Click to Start Your Story
            </Button>
          </Box>
        </FadeIn>
      )}
      {!!story.length && (
        <Box
          display="flex"
          alignItems="center"
          height={`calc(100vh - ${LAYOUT_SIZES.navigationBar.height})`}
        >
          <FadeIn>
            <Grid container spacing={4} sx={{ pt: 16 }}>
              <Grid item lg={7} md={6} sm={12}>
                <Box sx={{ overflowY: "auto", maxHeight: "500px" }}>
                  {story.map(({ story, choice }) => (
                    <Typography variant="h3" sx={{ whiteSpace: "pre-wrap" }}>
                      {choice ? `\nChoice: ${choice}` : `\n${story}`}
                    </Typography>
                  ))}
                  <a href="#bottomTarget" />
                </Box>
              </Grid>
              <Grid item lg={5} md={6} sm={12}>
                {isDecisionLoading && (
                  <>
                    <Skeleton
                      sx={{ display: "block", height: "40px", mt: 2, mb: 2 }}
                    />
                    <Skeleton
                      sx={{ display: "block", height: "40px", mt: 2, mb: 2 }}
                    />
                    <Skeleton
                      sx={{ display: "block", height: "40px", mt: 2, mb: 2 }}
                    />
                  </>
                )}
                {!isDecisionLoading &&
                  choices.map((c) => {
                    return (
                      <Button
                        sx={{
                          display: "block",
                          mt: 2,
                          mb: 2,
                          textAlign: "start",
                          width: "100%",
                        }}
                        onClick={() => makeDecision(c.content)}
                        variant="outlined"
                      >
                        {c.type}: {c.content}
                      </Button>
                    );
                  })}
                <Box sx={{ mt: "auto", mb: 0 }}>
                  <TextField
                    focused
                    variant="outlined"
                    multiline
                    minRows={3}
                    maxRows={5}
                    value={decisionInput}
                    fullWidth
                    placeholder="Type your own decision..."
                    inputProps={{ maxLength: MAX_DECISION_LENGTH }}
                    helperText={`${decisionInput.length} / ${MAX_DECISION_LENGTH}`}
                    onChange={(e) => setDecisionInput(e.target.value)}
                  />
                  <Button
                    sx={{
                      mt: 2,
                      marginRight: 0,
                      marginLeft: "auto",
                      display: "block",
                    }}
                    variant="contained"
                    onClick={() => makeDecision(decisionInput)}
                  >
                    <Typography variant="h3">Submit</Typography>
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </FadeIn>
        </Box>
      )}
    </Page>
  );
};

export default MainPage;
