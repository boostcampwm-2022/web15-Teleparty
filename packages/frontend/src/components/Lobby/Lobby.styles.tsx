import styled from "styled-components";

const LobbyLayout = styled.main<{ ratio: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  height: 100vh;
  padding-top: 30px;
  transform: scale(${({ ratio }) => ratio});
`;

const LobbyContentBox = styled.div`
  display: flex;
  gap: 3rem;
  height: 60rem;
`;

const LobbyRightContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LobbyButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export { LobbyLayout, LobbyContentBox, LobbyRightContentBox, LobbyButtonBox };
