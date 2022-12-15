import styled from "styled-components";

export const AvatarChangerButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 60px;
  height: 60px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  box-shadow: ${(props) => props.theme.shadows.medium};
  background-color: ${(props) => props.theme.colors.white};
  transition: opacity 250ms ease;
  cursor: pointer;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
`;

export const AvatarChangerLayout = styled.div`
  position: relative;
`;
