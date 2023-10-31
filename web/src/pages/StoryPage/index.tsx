import Page from "layout/Page";
import { useCallback, useState } from "react";
import { Button, Box, useMediaQuery, CircularProgress } from "@mui/material";
import FadeIn from "components/animated/FadeIn";
import { useGetStory, useStartStory } from "api/__generated__/server";
import { LAYOUT_SIZES } from "theme";
import StoryContent from "./StoryContent";
import { StorySectionItem } from "./types";
import { StoryWithChoices } from "api/__generated__/schemas";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";

const StoryPage = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up(1200));
  const { storyId } = useParams<{ storyId: string }>();
  const [sections, setSections] = useState<StorySectionItem[]>([]);
  const { data, isLoading } = useGetStory(storyId!, {
    query: {
      onSuccess: ({ data: story }) => {
        setSections(
          story.StorySection.map((section) => {
            if (section.type === "STORY") {
              return {
                story: section.content,
                choice: undefined,
              };
            }
            return {
              story: undefined,
              choice: section.content,
            };
          })
        );
      },
    },
  });
  // const { mutate: start, isLoading } = useStartStory({
  //   mutation: {
  //     onSuccess: ({ data }) => {
  //       setSections((prev) => [...prev, { story: data.story }]);
  //       setChoices(data.choices);
  //     },
  //   },
  // });

  // const startStory = useCallback(() => {
  //   start({
  //     data: {
  //       title: "Test Title",
  //       story: "Story about a building that never stops growing.",
  //     },
  //   });
  // }, []);

  const addStorySection = (type: "story" | "choice", content: string) => {
    // @ts-ignore
    setSections((prev) => [...prev, { [type]: content }]);
  };

  const largeStyle = isLarge ? { display: "flex", alignItems: "center" } : {};

  return (
    <Page>
      {/* {!sections.length && (
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
      )} */}

      <Box
        {...largeStyle}
        sx={{ px: 8 }}
        height={`calc(100vh - ${LAYOUT_SIZES.navigationBar.height})`}
      >
        <FadeIn>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <StoryContent
              published={!!data?.data.published}
              storyId={storyId!}
              sections={sections}
              // choices={choices}
              onUpdateStory={addStorySection}
            />
          )}
        </FadeIn>
      </Box>
    </Page>
  );
};

export default StoryPage;
