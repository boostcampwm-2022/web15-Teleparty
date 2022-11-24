import {
  PaintToolBoxContainer,
  StrokeChangerContainer,
} from "./PaintToolBox.styles";

import Palette from "../Palette/Palette.component";
import Thickness from "../Thickness/Thickness.component";
import ToolBox from "../ToolBox/ToolBox.component";
import Transparency from "../Transparency/Transparency.component";

const PaintToolBox = () => {
  return (
    <PaintToolBoxContainer>
      <Palette />
      <ToolBox />
      <StrokeChangerContainer>
        <Thickness />
        <Transparency />
      </StrokeChangerContainer>
    </PaintToolBoxContainer>
  );
};

export default PaintToolBox;
