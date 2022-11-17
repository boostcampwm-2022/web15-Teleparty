import {
  PaintBoardLayout,
  ToolContainer,
  StrokeChangerContainer,
} from "./PaintBoard.styles";

import Canvas from "../Canvas/Canvas.component";
import Palette from "../Palette/Palette.component";
import Thickness from "../Thickness/Thickness.component";
import ToolBox from "../ToolBox/ToolBox.component";
import Transparency from "../Transparency/Transparency.component";

const PaintBoard = () => {
  return (
    <PaintBoardLayout>
      <Canvas />
      <ToolContainer>
        <Palette />
        <ToolBox />
        <StrokeChangerContainer>
          <Thickness />
          <Transparency />
        </StrokeChangerContainer>
      </ToolContainer>
    </PaintBoardLayout>
  );
};

export default PaintBoard;
