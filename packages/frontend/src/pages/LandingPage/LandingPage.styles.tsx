import styled from "styled-components";

export const LandingPageLayout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;
  height: 100vh;
  background: ${(props) => props.theme.gradients.background};
`;
