import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import PageLayout from "./PageLayout";
import styled from "@emotion/styled";
import FadeIn from "components/animated/FadeIn";

interface IPageContentProps {
  imageUrl: string;
  poem: string;
  mobile: boolean;
}

const PageContent = ({ poem, imageUrl, mobile }: IPageContentProps) => {
  const theme = useTheme();
  return (
    <PageLayout mobile={mobile}>
      <FadeIn delay={800}>
        <StyledImg
          src={imageUrl}
          alt="Generated image"
          style={{ marginBottom: mobile ? theme.spacing(6) : 0 }}
        />
      </FadeIn>
      <FadeIn delay={800}>
        <Typography
          variant="h3"
          sx={{ whiteSpace: "pre-wrap", textAlign: "center" }}
        >
          {poem}
        </Typography>
      </FadeIn>
    </PageLayout>
  );
};

const StyledImg = styled.img`
  max-height: ${({ theme }) => theme.spacing(60)};
  max-width: ${({ theme }) => theme.spacing(60)};
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  border-radius: 12px;
`;

export default PageContent;
