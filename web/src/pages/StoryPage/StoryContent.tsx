import { Grid, Box, Typography, TextField, Chip, Divider } from "@mui/material";
import { useDecision, useEndStory } from "api/__generated__/server";
import { useCallback, useEffect, useRef, useState } from "react";
import { StorySectionItem } from "./types";
import { useNavigate } from "react-router-dom";
import { BookRounded, CheckRounded } from "@mui/icons-material";
import MuiButton from "components/MuiButton";
import { useTheme } from "@emotion/react";

type IStoryContentProps = {
  sections: StorySectionItem[];
  published: boolean;
  finalStory?: string;
  // choices: {
  //   type: "active" | "passive" | "neutral";
  //   content: string;
  // }[];
  storyId: string;
  onUpdateStory: (type: "story" | "choice", content: string) => void;
};

const MAX_DECISION_LENGTH = 160;
const StoryContent = ({
  storyId,
  finalStory,
  sections,
  published,
  // choices,
  onUpdateStory,
}: IStoryContentProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [decisionInput, setDecisionInput] = useState<string>("");
  const scrollableRef = useRef<HTMLDivElement>();
  const { mutate: decide, isLoading: isDecisionLoading } = useDecision({
    mutation: {
      onSuccess: ({ data }) => {
        onUpdateStory("story", data.story);
      },
    },
  });
  const { mutate: endStory, isLoading: isFinishing } = useEndStory({
    mutation: {
      onSuccess: () => {
        navigate("/stories");
      },
    },
  });

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
      onUpdateStory("choice", choice);
      setDecisionInput("");
    },
    [storyId]
  );

  useEffect(() => {
    const scrollable = scrollableRef.current;
    if (!scrollable || published) {
      return;
    }

    scrollable.scrollTop = scrollable.scrollHeight - scrollable.clientHeight;
  }, [sections, published]);

  return (
    <Grid container spacing={4} sx={{ py: 4 }}>
      <Grid item lg={12} md={12}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          {!published && (
            <Chip
              sx={{ ml: "auto", mr: 0 }}
              icon={<BookRounded />}
              variant="filled"
              label="In Progress"
            />
          )}
          {published && (
            <Chip
              sx={{ ml: "auto", mr: 0 }}
              icon={<CheckRounded />}
              variant="filled"
              label="Published"
            />
          )}
        </Box>
        <Box
          ref={scrollableRef}
          sx={{ overflowY: "auto", maxHeight: "400px", position: "relative" }}
        >
          {finalStory && (
            <>
              <Typography
                variant="h2"
                sx={{
                  py: 2,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "black",
                }}
              >
                Your Story
              </Typography>
              <Typography variant="h3" sx={{ whiteSpace: "pre-wrap" }}>
                {finalStory}
              </Typography>
              <Divider sx={{ borderColor: "white", my: 2 }} />
            </>
          )}
          <Typography
            variant="h2"
            sx={{
              py: 2,
              position: "sticky",
              top: 0,
              backgroundColor: "black",
            }}
          >
            Story Progression
          </Typography>
          {sections.map(({ story, choice }, i) => (
            <Typography key={i} variant="h3" sx={{ whiteSpace: "pre-wrap" }}>
              {choice ? `\nChoice: ${choice}` : `\n${story}`}
            </Typography>
          ))}
        </Box>
      </Grid>
      {!published && (
        <Grid item lg={5} md={12} sx={{ ml: "auto", mr: 0 }} width="100%">
          <Box sx={{ mt: "auto", mb: 0 }}>
            <TextField
              focused
              variant="outlined"
              multiline
              minRows={3}
              maxRows={5}
              value={decisionInput}
              fullWidth
              placeholder="Type your decision..."
              inputProps={{ maxLength: MAX_DECISION_LENGTH }}
              helperText={`${decisionInput.length} / ${MAX_DECISION_LENGTH}`}
              onChange={(e) => setDecisionInput(e.target.value)}
            />
            <MuiButton
              sx={{
                mt: 2,
                marginRight: 0,
                marginLeft: "auto",
                display: "block",
                width: "150px",
              }}
              variant="contained"
              disabled={isFinishing}
              loading={isDecisionLoading}
              onClick={() => makeDecision(decisionInput)}
            >
              <Typography variant="h3">Submit</Typography>
            </MuiButton>

            <MuiButton
              sx={{
                mt: 2,
                marginRight: 0,
                marginLeft: "auto",
                display: "block",
                width: "150px",
              }}
              variant="outlined"
              disabled={isDecisionLoading}
              loading={isFinishing}
              onClick={(e) => {
                e.preventDefault();
                endStory({ id: storyId });
              }}
            >
              <Typography variant="h3">End Story</Typography>
            </MuiButton>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default StoryContent;
