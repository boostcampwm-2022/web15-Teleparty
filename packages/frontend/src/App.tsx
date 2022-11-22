import { ThemeProvider } from "styled-components";

import GlobalStyles from "./global-styles/global-styles";
import { theme } from "./global-styles/theme";
import LandingPage from "./pages/LandingPage/LandingPage.component";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <LandingPage />
    </ThemeProvider>
  );
};

export default App;
