import Page from "layout/Page";
import { useCallback, useState } from "react";
import { Box, useMediaQuery, CircularProgress } from "@mui/material";
import FadeIn from "components/animated/FadeIn";
import { useGetStory } from "api/__generated__/server";
import { LAYOUT_SIZES } from "theme";
import StoryContent from "./StoryContent";
import { StorySectionItem } from "./types";
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

  const addStorySection = (type: "story" | "choice", content: string) => {
    // @ts-ignore
    setSections((prev) => [...prev, { [type]: content }]);
  };

  const largeStyle = isLarge ? { display: "flex", alignItems: "center" } : {};

  return (
    <Page>
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
