import { DefaultTheme } from "styled-components";

const colors = {
	// primary
	primary: "#212269",
	primaryDark: "#15164A",
	primaryLight: "#CCCDFF",

	// black-white
	black: "#222",
	grey1: "#888",
	grey2: "#BBB",
	grey3: "#D7D7D7",
	grey4: "#F6F6F6",
	white: "#fff",

	// other colors
	red: "#F45452",
  green: "#5DE173",
	yellow: "#FFEFA1",
};

export type ColorsType = typeof colors;

export const theme: DefaultTheme = {
	colors,
};