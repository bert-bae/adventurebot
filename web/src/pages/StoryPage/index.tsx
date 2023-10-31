import Page from "layout/Page";
import { useCallback, useState } from "react";
import { Button, Box, useMediaQuery } from "@mui/material";
import FadeIn from "components/animated/FadeIn";
import { useStartStory } from "api/__generated__/server";
import { LAYOUT_SIZES } from "theme";
import StoryContent from "./StoryContent";
import { StorySectionItem } from "./types";
import { StoryWithChoices } from "api/__generated__/schemas";
import { useTheme } from "@emotion/react";

// import { useWebsocket } from "utils/hooks/useWebsocket";
// const websocket = useWebsocket(`ws://localhost:5001`);

const StoryPage = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up(1200));
  const [storyId, setStoryId] = useState<string>("");
  const [sections, setSections] = useState<StorySectionItem[]>([]);
  const [choices, setChoices] = useState<
    {
      type: "active" | "passive" | "neutral";
      content: string;
    }[]
  >([]);
  const { mutate: start, isLoading } = useStartStory({
    mutation: {
      onSuccess: ({ data }) => {
        setStoryId(data.id);
        setSections((prev) => [...prev, { story: data.story }]);
        setChoices(data.choices);
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

  const addStorySection = (type: "story" | "choice", content: string) => {
    // @ts-ignore
    setSections((prev) => [...prev, { [type]: content }]);
  };

  const updateChoices = (choices: StoryWithChoices["choices"]) => {
    setChoices(choices);
  };

  const largeStyle = isLarge ? { display: "flex", alignItems: "center" } : {};

  return (
    <Page>
      {!sections.length && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={`calc(100vh - ${LAYOUT_SIZES.navigationBar.height})`}
        >
          <Button variant="contained" onClick={startStory} disabled={isLoading}>
            Click to Start Your Story
          </Button>
        </Box>
      )}
      {!!sections.length && (
        <Box
          {...largeStyle}
          sx={{ px: 8 }}
          height={`calc(100vh - ${LAYOUT_SIZES.navigationBar.height})`}
        >
          <FadeIn>
            <StoryContent
              key={storyId}
              storyId={storyId}
              sections={sections}
              choices={choices}
              onUpdateChoices={updateChoices}
              onUpdateStory={addStorySection}
            />
          </FadeIn>
        </Box>
      )}
    </Page>
  );
};

export default StoryPage;
