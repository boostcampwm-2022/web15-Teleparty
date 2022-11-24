import styled, { css } from "styled-components";

interface AvatarProps {
  variant: "small" | "medium" | "large";
}

const Avatar = styled.img<AvatarProps>`
  border-radius: 50%;
  aspect-ratio: 1/1;
  border: 2px solid ${({ theme: { colors } }) => colors.primary};
  box-shadow: ${({ theme: { shadows } }) => shadows.small};
  background-color: ${({ theme: { colors } }) => colors.grey3};

  ${({ variant }) =>
    variant === "small" &&
    css`
      width: 2.5rem;
    `}
  ${({ variant, theme: { colors } }) =>
    variant === "medium" &&
    css`
      width: 5rem;
      border-color: ${colors.primaryLight};
    `}
    ${({ variant }) =>
    variant === "large" &&
    css`
      width: 16rem;
    `};
`;

export { Avatar };
