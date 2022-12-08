import styled from "styled-components";

interface HidableBoxProps {
  hide: boolean;
}

export const HidableBox = styled.div<HidableBoxProps>`
  ${({ hide }) => hide && `visibility: hidden`}
`;
