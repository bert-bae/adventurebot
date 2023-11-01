import React from "react";
import { Container } from "@mui/material";
import { styled } from "@mui/system";
import { LAYOUT_SIZES } from "theme";

type PageWrapperProps = React.FC<{ children: any }>;

const MainContainer = styled(Container)`
  height: fit-content;
  min-height: 100%;
  height: 100%;
  width: 100%;
  padding-top: ${LAYOUT_SIZES.navigationBar.height};
  box-sizing: border-box;
  margin-left: 0;
  overflow-y: auto;
`;

const PageWrapper: PageWrapperProps = (props) => {
  return <MainContainer maxWidth={false}>{props.children}</MainContainer>;
};

export default PageWrapper;
