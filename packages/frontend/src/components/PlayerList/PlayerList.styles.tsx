import styled, { css } from "styled-components";

interface PlayerListLayoutProps {
  sizeType: "medium" | "large";
}

export const PersonnelCountParagraph = styled.p`
  padding: 4px 8px 6px 8px;
  border-radius: 4px;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.15rem;
  font-weight: bold;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};
`;

export const PlayerItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PlayerListLayout = styled.div<PlayerListLayoutProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  padding: 12px 24px 24px 24px;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};
  border-radius: 15px;
  /* size */
  ${(props) =>
    props.sizeType === "medium" &&
    css`
      height: 620px;
    `}

  ${(props) =>
    props.sizeType === "large" &&
    css`
      height: 744px;
    `}

  ${PersonnelCountParagraph} {
    margin-bottom: 12px;
  }
`;
