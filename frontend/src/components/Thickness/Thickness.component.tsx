import { useState } from "react";

import { ThicknessButton, ThicknessLayout } from "./Thickness.styles";

const THICKNESS = {
  X_SMALL: 0.375,
  SMALL: 0.75,
  MEDIUM: 1.125,
  LARGE: 1.5,
  X_LARGE: 1.875,
};

const Thickness = () => {
  const [thick, setThick] = useState(THICKNESS.MEDIUM);

  const onThicknessClick = (thickness: number) => () => setThick(thickness);

  return (
    <ThicknessLayout>
      {Object.values(THICKNESS).map((thickness, index) => (
        <ThicknessButton
          key={index}
          size={thickness}
          selected={thick === thickness}
          onClick={onThicknessClick(thickness)}
        />
      ))}
    </ThicknessLayout>
  );
};

export default Thickness;
