import { ThemeProvider } from "styled-components";

import GlobalStyles from "./global-styles/global-styles";
import { theme } from "./global-styles/theme";
import CanvasPage from "./pages/CanvasPage/CanvasPage.component";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CanvasPage />
    </ThemeProvider>
  );
};

export default App;
