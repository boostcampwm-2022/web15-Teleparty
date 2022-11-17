import { CanvasPageLayout } from "./CanvasPage.styles";

import PaintBoard from "../../components/PaintBoard/PaintBoard.component";

const CanvasPage = () => {
  return (
    <CanvasPageLayout>
      <PaintBoard />
    </CanvasPageLayout>
  );
};

export default CanvasPage;
