import styled from "styled-components";

const AlbumLayout = styled.div`
  width: 57rem;
  height: 26.5rem;
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.primaryLightTransparent};
  border-radius: 25px;
  box-shadow: ${({ theme: { shadows } }) => shadows.medium};
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  & > * + * {
    margin-top: 0.5rem;
  }
`;

const AlbumText = styled.span<{ isRightSide: boolean }>`
  width: fit-content;
  box-shadow: ${({ theme: { shadows } }) => shadows.medium};
  padding: 1rem;
  border-radius: ${({ isRightSide }) =>
    isRightSide ? "20px 0 20px 20px" : "0 20px 20px 20px"};
  background-color: ${({ theme: { colors } }) => colors.white};
  color: ${({ theme: { colors } }) => colors.primaryDark};
  word-break: break-all;
  line-height: 22px;
  border: 1px solid ${({ theme: { colors } }) => colors.primaryLight};
`;

const AlbumNextLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const AlbumNextText = styled.span`
  display: flex;
  width: 100%;
  flex-basis: 100%;
  align-items: center;
  font-size: 12px;
  text-align: center;
  font-weight: 700;
  margin: 1rem 0;
  color: ${({ theme: { colors } }) => colors.primary};

  &::before,
  &::after {
    content: "";
    flex-grow: 1;
    background: ${({ theme: { colors } }) => colors.primary};
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 16px;
  }
`;

const AlbumNextButtonBox = styled.div`
  display: flex;
  gap: 1rem;
`;

export {
  AlbumText,
  AlbumLayout,
  AlbumNextLayout,
  AlbumNextText,
  AlbumNextButtonBox,
};
