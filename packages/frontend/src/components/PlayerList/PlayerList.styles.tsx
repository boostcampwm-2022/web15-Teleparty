import styled from "styled-components";

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

export const PlayerListLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  padding: 12px 24px 24px 24px;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};

  ${PersonnelCountParagraph} {
    margin-bottom: 12px;
  }
`;
