import { useEffect } from "react";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  PaletteColorBox,
  PaletteLayout,
  PaletteColorPicker,
  PaletteGrid,
} from "./Palette.styles";

import { theme } from "../../global-styles/theme";
import { paletteAtom } from "../../store/tool";

import type { ColorsType } from "../../global-styles/theme";

const PALETTE_COLORS = [
  "black",
  "white",
  "red",
  "pink",
  "orange",
  "yellow-palette",
  "green-palette",
  "blue",
  "indigo",
  "violet",
] as const;

const Palette = () => {
  const [color, setColor] = useAtom(paletteAtom);
  const resetColor = useResetAtom(paletteAtom);

  const onColorBoxClick = (color: keyof ColorsType) => () =>
    setColor(theme.colors[color]);

  useEffect(() => {
    resetColor();
  }, []);

  return (
    <PaletteLayout>
      <PaletteGrid>
        {PALETTE_COLORS.map((color, index) => (
          <PaletteColorBox
            key={index}
            bgColor={color as keyof ColorsType}
            onClick={onColorBoxClick(color as keyof ColorsType)}
          />
        ))}
      </PaletteGrid>
      <PaletteColorPicker
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </PaletteLayout>
  );
};

export default Palette;
