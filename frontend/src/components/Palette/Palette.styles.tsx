import styled from "styled-components";

import { ColorsType } from "../../global-styles/theme";

const PaletteLayout = styled.div`
  display: flex;
  width: fit-content;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};
  border-radius: 10px;
  padding: 1rem;
  gap: 0.25rem;
  justify-items: center;
  align-items: center;
`;

const PaletteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: fit-content;
  gap: 0.25rem;
  justify-items: center;
  align-items: center;
`;

const PaletteColorBox = styled.div<{ bgColor: keyof ColorsType }>`
  background-color: ${(props) => props.theme.colors[props.bgColor]};
  border: 1px solid ${(props) => props.theme.colors.primary};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 5px;
  cursor: pointer;
`;

const PaletteColorPicker = styled.input`
  &::-webkit-color-swatch {
    border-color: transparent;
  }
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-moz-color-swatch {
    border-color: transparent;
  }
  border: 1px solid ${(props) => props.theme.colors.primary};
  overflow: hidden;
  width: 2.5rem;
  height: 5.25rem;
  grid-row: span 2 / span 2;
  border-radius: 5px;
  cursor: pointer;
  padding: 0;
`;

export { PaletteLayout, PaletteColorBox, PaletteColorPicker, PaletteGrid };
