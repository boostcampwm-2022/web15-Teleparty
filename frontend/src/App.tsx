import styled, { ThemeProvider } from "styled-components";

import Icon from "./components/Icon/Icon";
import GlobalStyles from "./global-styles/global-styles";
import { theme } from "./global-styles/theme";
import Test from "./pages/Test";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Test />
    </ThemeProvider>
  );
};

export default App;
