import styled from "styled-components";

const RoomPageLayout = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rem;
  height: 100vh;
  ${(props) => props.theme.backgrounds.nightCity}
`;

const RoomPageContentBox = styled.div`
  display: flex;
  gap: 8rem;
  height: 60rem;
`;

const RoomPageRightContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RoomPageButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export {
  RoomPageLayout,
  RoomPageContentBox,
  RoomPageRightContentBox,
  RoomPageButtonBox,
};
