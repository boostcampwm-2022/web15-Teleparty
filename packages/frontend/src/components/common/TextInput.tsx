import styled, { css } from "styled-components";

interface TextInputProps {
  sizeType: "medium" | "large";
}

export const TextInput = styled.input<TextInputProps>`
  border: 1px solid ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primary};
  box-shadow: ${(props) => props.theme.shadows.small};
  opacity: 0.6;

  ${(props) =>
    props.sizeType === "medium" &&
    css`
      width: 256px;
      height: 36px;
      padding: 8px;
      border-width: 2px;
      border-radius: 8px;
      font-size: 0.85rem;
    `}

  ${(props) =>
    props.sizeType === "large" &&
    css`
      width: 830px;
      height: 65px;
      padding: 20px;
      border-width: 4px;
      border-radius: 20px;
      font-size: 1.5rem;
    `}

  &:focus {
    outline: none;
    opacity: 1;
  }
`;
