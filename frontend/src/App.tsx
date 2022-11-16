import { ThemeProvider } from "styled-components";

import Canvas from "./components/Canvas/Canvas.component";
import GlobalStyles from "./global-styles/global-styles";
import { theme } from "./global-styles/theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Canvas/>
    </ThemeProvider>
  );
};

export default App;
