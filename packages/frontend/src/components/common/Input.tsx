import styled, { css } from "styled-components";

interface InputProps {
  variant: "medium" | "nickname";
}

const Input = styled.input<InputProps>`
  border-style: solid;
  box-shadow: ${({ theme: { shadows } }) => shadows.small};
  width: 100%;
  transition: border-color 0.1s;
  color: ${({ theme: { colors } }) => colors.primary};

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
    variant === "nickname" &&
    css`
      width: 16rem;
      height: 2.25rem;
      padding: 0.5rem;
      border-width: 2px;
      border-radius: 8px;
      font-size: 14px;
      opacity: 0.6;
      border-color: ${({ theme: { colors } }) => colors.primary};
      transition: all 0.1s;
      &:focus {
        opacity: 1;
      }
    `}
`;

export { Input };
