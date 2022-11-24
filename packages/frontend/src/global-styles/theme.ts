import { css } from "styled-components";

import backgroundSrc from "../assets/background.svg";

import type { DefaultTheme } from "styled-components";

export const colors = {
  // primary
  primary: "#212269",
  primaryDark: "#15164A",
  primaryLight: "#CCCDFF",
  primaryLightTransparent: "rgba(204,205,255,0.4)",
  primaryLightLowTransparent: "rgba(204,205,255,0.8)",
  primaryLowTransparent: "rgba(33,34,105,0.6)",
  primaryHighTransparent: "rgba(33,34,105,0.3)",
  primaryTransparent: "rgba(33,34,105,0.4)",

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
  background: "linear-gradient(180deg, #373067 0%, #AB6684 100%)",
};

export const shadows = {
  small: "0px 1px 2px 0px rgba(0, 0, 0, 0.1)",
  medium: "0 4px 6px -1px rgb(0, 0, 0, 0.1), 0 2px 4px -2px rgb(0, 0, 0, 0.1)",
};

export const gradients = {
  // purple tone
  background: "linear-gradient(0deg, #373067, #ab6684)",
};

export const backgrounds = {
  nightCity: css`
    background-image: url(${backgroundSrc});
    background-position: center;
    background-size: cover;
  `,
};

export type ColorsType = typeof colors;
export type GradientsType = typeof gradients;
export type BackgroundsType = typeof backgrounds;
export type ShadowsType = typeof shadows;

export const theme: DefaultTheme = {
  colors,
  gradients,
  backgrounds,
  shadows,
};
