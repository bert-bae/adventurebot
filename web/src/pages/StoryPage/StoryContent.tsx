import {
  Grid,
  Box,
  Typography,
  Button,
  Skeleton,
  TextField,
} from "@mui/material";
import { useDecision, useEndStory } from "api/__generated__/server";
import { useCallback, useState } from "react";
import { StorySectionItem } from "./types";
import { StoryWithChoices } from "api/__generated__/schemas";
import { useNavigate } from "react-router-dom";

type IStoryContentProps = {
  sections: StorySectionItem[];
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
  sections,
  // choices,
  onUpdateStory,
}: IStoryContentProps) => {
  const navigate = useNavigate();
  const [decisionInput, setDecisionInput] = useState<string>("");
  const { mutate: decide, isLoading: isDecisionLoading } = useDecision({
    mutation: {
      onSuccess: ({ data }) => {
        onUpdateStory("story", data.story);
      },
    },
  });
  const { mutate: endStory } = useEndStory({
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

  return (
    <Grid container spacing={4}>
      <Grid item lg={12} md={12}>
        <Box sx={{ overflowY: "auto", maxHeight: "400px" }}>
          {sections.map(({ story, choice }, i) => (
            <Typography key={i} variant="h3" sx={{ whiteSpace: "pre-wrap" }}>
              {choice ? `\nChoice: ${choice}` : `\n${story}`}
            </Typography>
          ))}
          <a href="#bottomTarget" />
        </Box>
      </Grid>
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
          <Button
            sx={{
              mt: 2,
              marginRight: 0,
              marginLeft: "auto",
              display: "block",
              width: "150px",
            }}
            variant="contained"
            onClick={() => makeDecision(decisionInput)}
          >
            <Typography variant="h3">Submit</Typography>
          </Button>
          <Button
            sx={{
              mt: 2,
              marginRight: 0,
              marginLeft: "auto",
              display: "block",
              width: "150px",
            }}
            variant="outlined"
            onClick={(e) => {
              e.preventDefault();
              endStory({ id: storyId });
            }}
          >
            <Typography variant="h3">End Story</Typography>
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StoryContent;
