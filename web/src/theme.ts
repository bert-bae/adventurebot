import { createTheme } from "@mui/material";

export const LAYOUT_SIZES = {
  appSideMenu: {
    height: "350px",
    width: "350px",
  },
  navigationBar: {
    height: "64px",
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: "#EF233C",
      light: "rgba(239, 35, 60, 0.5)",
    },
    secondary: {
      main: "#4D6CFA",
    },
    error: {
      main: "#FF001F",
    },
    warning: {
      main: "#FFBB00",
    },
    success: {
      main: "#00C04D",
    },
    info: {
      main: "#4D6CFA",
    },
    text: {
      primary: "#fff",
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: "'VT323';",
    h1: {
      fontSize: "48px",
      fontWeight: "bolder",
    },
    h2: {
      fontSize: "32px",
      fontWeight: "regular",
    },
    h3: {
      fontSize: "24px",
    },
    h4: {
      fontSize: "16px",
      textTransform: "uppercase",
      letterSpacing: "10%",
    },
    h5: {
      fontSize: "16px",
    },
    body1: {
      fontSize: "14px",
    },
    caption: {
      fontSize: "12px",
      fontWeight: "bold",
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: "12px",
      lineHeight: 1.25,
    },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiButton: {
      styleOverrides: {},
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#fff",
          textAlign: "end",
        },
      },
    },
  },
});
