import styled, { css } from "styled-components";

interface InputProps {
  variant: "medium" | "large";
}

const Input = styled.input<InputProps>`
  border-style: solid;
  box-shadow: ${({ theme: { shadows } }) => shadows.small};
  width: 100%;
  transition: border-color 0.1s;

  &::placeholder {
    color: ${({ theme: { colors } }) => colors.grey1};
  }
  &:focus {
    border-color: ${({ theme: { colors } }) => colors.primary};
    outline: none;
  }
  &:disabled {
    border-color: ${({ theme: { colors } }) => colors.primaryLight};
  }

  ${({ variant }) =>
    variant === "medium" &&
    css`
      border-color: ${({ theme: { colors } }) => colors.grey3};
      border-width: 1px;
      border-radius: 8px;
      height: 2.25rem;
      padding: 0.5rem;
      font-size: 14px;
    `}
  ${({ variant }) =>
    variant === "large" &&
    css`
      border-color: ${({ theme: { colors } }) => colors.primary};
      border-width: 4px;
      border-radius: 20px;
      height: 4rem;
      padding: 0.5rem 1rem;
      font-size: 24px;
    `}
`;

export { Input };
