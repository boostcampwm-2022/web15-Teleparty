import styled from "styled-components";

export const CanvasLayout = styled.canvas`
	width: 1036px;
	height: 644px;
	border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 10px;
`;
