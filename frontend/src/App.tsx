import { ThemeProvider } from "styled-components";

import Canvas from "./components/Canvas/Canvas.component";
import ToolBox from "./components/ToolBox/ToolBox.component";
import GlobalStyles from "./global-styles/global-styles";
import { theme } from "./global-styles/theme";
import Test from "./pages/Test";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Canvas/>
      <Test />
      <ToolBox/>
    </ThemeProvider>
  );
};

export default App;
