import GlobalStyles from "./global-styles/global-styles";
import { ThemeProvider } from "styled-components";
import { theme } from "./global-styles/theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <></>
    </ThemeProvider>
  );
};

export default App;
