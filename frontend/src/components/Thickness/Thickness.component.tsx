import {useAtom} from "jotai"

import { ThicknessButton, ThicknessLayout } from "./Thickness.styles";

import { THICKNESS_VALUES, thicknessAtom } from "../../store/thickness"

const Thickness = () => {
  const [thick, setThick] = useAtom(thicknessAtom);

  const onThicknessClick = (thickness: number) => () => setThick(thickness);

  return (
    <ThicknessLayout>
      {THICKNESS_VALUES.map((thickness, index) => (
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
