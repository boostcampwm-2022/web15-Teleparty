import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "styled-components";

import GlobalStyles from "./global-styles/global-styles";
import { theme } from "./global-styles/theme";
import CanvasPage from "./pages/CanvasPage/CanvasPage.component";
import LandingPage from "./pages/LandingPage/LandingPage.component";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="canvas" element={<CanvasPage />}></Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
