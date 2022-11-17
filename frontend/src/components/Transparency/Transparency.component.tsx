import { useEffect, useRef, useState } from "react";

import {
  TransparencyCircle,
  TransparencyLayout,
  TransparencyRange,
} from "./Transparency.styles";

const RANGE_PROPS = {
  MIN: "0",
  MAX: "1",
  STEP: "0.01",
};

const Transparency = () => {
  const [transparency, setTransparency] = useState(RANGE_PROPS.MAX);
  const rangeRef = useRef<HTMLInputElement>(null);

  const setRangeProps = () => {
    if (!rangeRef.current) return;
    rangeRef.current.min = RANGE_PROPS.MIN;
    rangeRef.current.max = RANGE_PROPS.MAX;
    rangeRef.current.step = RANGE_PROPS.STEP;
  };
  const onTransparencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeProps();
    setTransparency(e.target.value);
  };

  useEffect(() => {
    console.log(transparency);
  }, [transparency]);

  return (
    <TransparencyLayout>
      <TransparencyCircle />
      <TransparencyRange
        ref={rangeRef}
        type="range"
        min={RANGE_PROPS.MIN}
        max={RANGE_PROPS.MAX}
        step={RANGE_PROPS.STEP}
        onChange={onTransparencyChange}
      />
      <TransparencyCircle filled />
    </TransparencyLayout>
  );
};

export default Transparency;
