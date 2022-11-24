import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "styled-components";

import GlobalStyles from "./global-styles/global-styles";
import { theme } from "./global-styles/theme";
import CanvasPage from "./pages/CanvasPage/CanvasPage.component";
import GamePage from "./pages/GamePage/GamePage.component";
import LandingPage from "./pages/LandingPage/LandingPage.component";
import RoomPage from "./pages/RoomPage/RoomPage.component";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="canvas" element={<CanvasPage />}></Route>
        <Route path="room" element={<RoomPage />}></Route>
        <Route path="game" element={<GamePage />}></Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
