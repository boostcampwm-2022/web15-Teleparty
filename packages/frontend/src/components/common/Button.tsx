import styled, { css } from "styled-components";

interface ButtonProps {
  variant: "small" | "medium" | "large" | "icon" | "transparent";
}

const Button = styled.button<ButtonProps>`
  border: none;
  cursor: pointer;
  transition: all 0.1s;
  fill: ${({ theme: { colors } }) => colors.primary};
  background-color: ${({ theme: { colors } }) => colors.primary};
  color: ${({ theme: { colors } }) => colors.white};
  border-radius: 8px;
  box-shadow: ${({ theme: { shadows } }) => shadows.medium};
  font-weight: 500;

  &:hover {
    fill: ${({ theme: { colors } }) => colors.primaryDark};
    background-color: ${({ theme: { colors } }) => colors.primaryDark};
  }
  &:focus {
    box-shadow: ${({ theme: { shadows } }) => shadows.medium},
      inset 0px 0px 0px 2px
        ${({ theme: { colors } }) => colors.primaryLightTransparent};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme: { colors } }) => colors.primaryLight};
    box-shadow: none;
  }

  ${({ variant }) =>
    variant === "transparent" &&
    css`
      padding: 0.25rem;
      background-color: transparent;
      box-shadow: none;
      :hover {
        background-color: transparent;
      }
      :focus {
        box-shadow: none;
      }
    `};
  ${({ variant }) =>
    variant === "small" &&
    css`
      width: 8.5rem;
      padding: 0.5rem;
      font-size: 14px;
    `};
  ${({ variant }) =>
    variant === "medium" &&
    css`
      width: 18rem;
      padding: 0.5rem;
      font-size: 16px;
      line-height: 22px;
    `};
  ${({ variant }) =>
    variant === "large" &&
    css`
      width: 21rem;
      padding: 1.5rem;
      font-size: 32px;
      line-height: 22px;
      border-radius: 20px;
    `};
  ${({ variant, theme: { colors } }) =>
    variant === "icon" &&
    css`
      fill: ${colors.white};
      width: fit-content;
      padding: 1rem;
      font-size: 32px;
      line-height: 22px;
      border-radius: 20px;
      :hover {
        fill: ${colors.white};
      }
    `};
`;

export { Button };
