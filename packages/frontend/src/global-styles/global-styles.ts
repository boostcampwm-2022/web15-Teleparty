import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyles = createGlobalStyle`
  ${reset}
  html {
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
    font-family: 'Noto Sans KR', sans-serif;
  }
  body{
    font-family: 'Noto Sans KR', sans-serif;
    ${(props) => props.theme.backgrounds.nightCity}
  }
`;

export default GlobalStyles;
