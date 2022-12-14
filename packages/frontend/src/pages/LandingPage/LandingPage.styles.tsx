import styled from "styled-components";

export const LandingPageLayout = styled.main<{ ratio: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;
  height: 100vh;
  transform: scale(${({ ratio }) => ratio});
`;
