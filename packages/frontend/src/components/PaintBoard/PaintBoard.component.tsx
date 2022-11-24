import { ReactNode } from "react";

import {
  PaintBoardHeader,
  PaintBoardCenterElementBox,
  PaintBoardFooter,
  PaintBoardLayout,
} from "./PaintBoard.styles";

interface PaintBoardProps {
  headerText?: string;
  centerElement?: ReactNode;
  footerElement?: ReactNode;
}

const PaintBoard = ({
  headerText,
  centerElement,
  footerElement,
}: PaintBoardProps) => {
  return (
    <PaintBoardLayout>
      <PaintBoardHeader>{headerText}</PaintBoardHeader>
      <PaintBoardCenterElementBox>{centerElement}</PaintBoardCenterElementBox>
      <PaintBoardFooter>{footerElement}</PaintBoardFooter>
    </PaintBoardLayout>
  );
};

export default PaintBoard;
