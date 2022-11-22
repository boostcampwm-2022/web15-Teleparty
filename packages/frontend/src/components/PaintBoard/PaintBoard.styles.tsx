import styled from "styled-components";

export const PaintBoardLayout = styled.div`
  padding: 15px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primaryLightTransparent};
`;

export const ToolContainer = styled.div`
  display: flex;
  margin-top: 15px;
  gap: 10px;
`;

export const StrokeChangerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  gap: 10px;
`;
