import styled from "styled-components";

const ThicknessLayout = styled.div`
  display: flex;
  width: fit-content;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};
  border-radius: 10px;
  padding: 0.5rem 1rem;
  gap: 1rem;
  justify-items: center;
  align-items: center;
`;

interface ThicknessButtonProps {
  size: number;
  selected?: boolean;
}

const ThicknessButton = styled.button<ThicknessButtonProps>`
  display: flex;
  background-color: transparent;
  border: 1px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.primary : theme.colors.primaryTransparent};
  width: 2.25rem;
  border-radius: 50%;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  padding: 0;

  &::after {
    content: "";
    background-color: ${({ selected, theme }) =>
      selected ? theme.colors.primary : theme.colors.primaryTransparent};
    width: ${({ size }) => size}rem;
    border-radius: 50%;
    aspect-ratio: 1/1;
  }
`;

export { ThicknessLayout, ThicknessButton };
