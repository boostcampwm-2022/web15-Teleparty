import styled, { css } from "styled-components";

interface PlayerListItemLayoutProps {
  sizeType: "medium" | "large";
  state: "normal" | "ready" | "turn";
}

interface AvatarContainerProps {
  spotlight?: boolean;
}

export const AvatarContainer = styled.div<AvatarContainerProps>`
  position: relative;
  width: 40px;
  height: 40px;
  border: 2px solid
    ${(props) =>
      props.spotlight ? props.theme.colors.green : props.theme.colors.primary};
  border-radius: 50%;
  box-shadow: ${(props) => props.theme.shadows.medium};
  background-color: rgba(255, 255, 255, 0.5);

  svg {
    position: absolute;
    top: -40%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const Name = styled.p`
  color: ${(props) => props.theme.colors.primary};
`;

export const Score = styled.p`
  font-weight: bold;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.primary};
`;

export const AudioToggleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border: 3px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  opacity: 0.75;
  transition: opacity 300ms ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;

  ${AvatarContainer} {
    margin-right: 5px;
  }
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;

  ${Score} {
    margin-right: 5px;
  }
`;

export const PlayerListItemLayout = styled.li<PlayerListItemLayoutProps>`
  display: flex;
  justify-content: space-between;
  height: 52px;
  padding: 4px 6px;
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.shadows.small};
  font-size: 1.1rem;
  background-color: ${(props) => props.theme.colors.primaryLight};

  /* size */
  ${(props) =>
    props.sizeType === "medium" &&
    css`
      width: 284px;
    `}

  ${(props) =>
    props.sizeType === "large" &&
    css`
      width: 432px;
    `}

  /* state => background color*/
  ${(props) =>
    props.state === "ready" &&
    css`
      background-color: ${(props) => props.theme.colors.green};
    `}

  ${(props) =>
    props.state === "turn" &&
    css`
      background-color: ${(props) => props.theme.colors.yellow};
    `}
`;
