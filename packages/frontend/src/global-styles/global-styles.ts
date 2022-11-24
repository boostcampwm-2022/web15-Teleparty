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
    background: ${({ theme: { colors } }) => colors.background};
    background-repeat: no-repeat;
    height: 100vh;
  }
`;

export default GlobalStyles;
