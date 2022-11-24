import styled from "styled-components";

export const ToolBoxLayout = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 40px);
  grid-template-columns: repeat(3, 40px);
  gap: 0.25rem;
  width: fit-content;
  padding: 1rem;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};
`;

export const ToolBoxCell = styled.button`
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 5px;
  background-color: transparent;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }

  &.selected {
    opacity: 1;
  }
`;
