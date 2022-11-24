import styled from "styled-components";

export const PaintBoardHeader = styled.header`
  padding: 12px;
  border-radius: 10px;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.primary};
`;

export const PaintBoardFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 116px;
  margin-top: 15px;
`;

export const PaintBoardCenterElementBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1036px;
  height: 644px;
`;

export const PaintBoardLayout = styled.div`
  padding: 15px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};

  ${PaintBoardHeader} {
    margin-bottom: 15px;
  }
`;

export const KeywordInputLayout = styled.div`
  width: 100%;
  padding: 1rem 4rem;
`;

export const PaintBoardButtonLayout = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;
