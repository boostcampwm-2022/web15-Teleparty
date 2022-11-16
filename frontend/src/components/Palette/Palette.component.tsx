import { useState } from "react";

import {
  PaletteColorBox,
  PaletteLayout,
  PaletteColorPicker,
} from "./Palette.styles";

import { theme } from "../../global-styles/theme";

import type { ColorsType } from "../../global-styles/theme";

const Palette = () => {
  const [color, setColor] = useState(theme.colors.pink);

  const onColorBoxClick = (color: keyof ColorsType) => () =>
    setColor(theme.colors[color]);

  return (
    <PaletteLayout>
      <PaletteColorBox bgColor="black" onClick={onColorBoxClick("black")} />
      <PaletteColorBox bgColor="white" onClick={onColorBoxClick("white")} />
      <PaletteColorBox bgColor="red" onClick={onColorBoxClick("red")} />
      <PaletteColorBox bgColor="pink" onClick={onColorBoxClick("pink")} />
      <PaletteColorBox bgColor="orange" onClick={onColorBoxClick("orange")} />
      <PaletteColorPicker
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <PaletteColorBox
        bgColor="yellow-palette"
        onClick={onColorBoxClick("yellow-palette")}
      />
      <PaletteColorBox
        bgColor="green-palette"
        onClick={onColorBoxClick("green-palette")}
      />
      <PaletteColorBox bgColor="blue" onClick={onColorBoxClick("blue")} />
      <PaletteColorBox bgColor="indigo" onClick={onColorBoxClick("indigo")} />
      <PaletteColorBox bgColor="violet" onClick={onColorBoxClick("violet")} />
    </PaletteLayout>
  );
};

export default Palette;
