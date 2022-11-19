/* eslint-disable import/no-anonymous-default-export */
import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    green: "#41FF00",
    green2: "#5bf870",
    test: "red",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const fonts = {
  heading: "Avenir Next, sans-serif",
  body: "VT323, monospace",
  mono: "VT323, monospace",
};

const theme = extendTheme({ colors, fonts });

export default theme;
