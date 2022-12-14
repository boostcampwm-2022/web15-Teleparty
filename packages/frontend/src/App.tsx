import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { useSetAtom } from "jotai";
import { useAtomsDevtools } from "jotai/devtools";
import { ThemeProvider } from "styled-components";

import GlobalStyles from "./global-styles/global-styles";
import { theme } from "./global-styles/theme";
import LandingPage from "./pages/LandingPage/LandingPage.component";
import RoomPage from "./pages/RoomPage/RoomPage.component";
import { ratioAtom } from "./store/ratio";

const MAX_HEIGHT = 1007;
const MAX_WIDTH = 1920;

const AtomsDevtools = ({ children }: { children: React.ReactElement }) => {
  useAtomsDevtools("demo");
  return children;
};

const App = () => {
  const setRatio = useSetAtom(ratioAtom);

  useEffect(() => {
    const resizeListener = () => {
      const heightRatio = window.innerHeight / MAX_HEIGHT;
      const widthRatio = window.innerWidth / MAX_WIDTH;
      if (heightRatio < widthRatio) {
        setRatio(heightRatio > 1 ? 1 : heightRatio);
      } else {
        setRatio(widthRatio > 1 ? 1 : widthRatio);
      }
    };

    resizeListener();
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [setRatio]);

  return (
    <ThemeProvider theme={theme}>
      <AtomsDevtools>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="room/*" element={<RoomPage />}></Route>
        </Routes>
      </AtomsDevtools>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default App;
