/* eslint-disable import/no-anonymous-default-export */
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const styles = {
  global: (props) => ({
    body: {
      backgroundColor: "red",
    },
    "*::placeholder": {
      color: mode("gray.400", "whiteAlpha.400")(props),
    },
    "*, *::before, &::after": {
      borderColor: mode("gray.200", "whiteAlpha.300")(props),
      wordWrap: "break-word",
    },
  }),
  colors: {
    brand: {
      green: "#41FF00",
      green2: "#5bf870",
      test: "red",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
  fonts: {
    heading: "Avenir Next, sans-serif",
    body: "VT323, monospace",
    mono: "VT323, monospace",
  },
};

const theme = extendTheme(styles);

export default theme;
