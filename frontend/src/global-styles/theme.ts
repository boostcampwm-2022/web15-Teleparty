import type { DefaultTheme } from "styled-components";

export const colors = {
  // primary
  primary: "#212269",
  primaryDark: "#15164A",
  primaryLight: "#CCCDFF",
  primaryLightTransparent: "rgba(204,205,255,0.4)",
  primaryLowTransparent: "rgba(33,34,105,0.6)",
  primaryHighTransparent: "rgba(33,34,105,0.3)",

  // black-white
  black: "#222222",
  grey1: "#888888",
  grey2: "#BBBBBB",
  grey3: "#D7D7D7",
  grey4: "#F6F6F6",
  white: "#FFFFFF",

  // other colors
  red: "#F45452",
  pink: "#FF659A",
  orange: "#FF922B",
  green: "#5DE173",
  "green-palette": "#51CF66",
  yellow: "#FFEFA1",
  "yellow-palette": "#FCC419",
  blue: "#339AF0",
  indigo: "#5C7CFA",
  violet: "#845EF7",
};

export type ColorsType = typeof colors;

export const theme: DefaultTheme = {
  colors,
};
