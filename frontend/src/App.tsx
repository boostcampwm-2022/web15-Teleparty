import GlobalStyles from "./global-styles/global-styles";
import { ThemeProvider } from "styled-components";
import { theme } from "./global-styles/theme";
import Icon from "./components/Icon/Icon";
import styled from "styled-components";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default App;
