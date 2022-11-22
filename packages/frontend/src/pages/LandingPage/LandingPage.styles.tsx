import styled from "styled-components";

export const LandingPageLayout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background: ${(props) => props.theme.gradients.background};
`;
