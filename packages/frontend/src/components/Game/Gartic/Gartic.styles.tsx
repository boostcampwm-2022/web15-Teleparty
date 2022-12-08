import styled from "styled-components";

const GarticResultLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const GarticResultContentLayout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 3rem;
`;

const GarticDrawImage = styled.img`
  width: 1036px;
  height: 644px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.white};
`;

export { GarticResultLayout, GarticResultContentLayout, GarticDrawImage };
