import styled from "styled-components";

export const WarningText = styled.p`
  width: 100%;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.red};
  word-wrap: break-word;
`;

export const NicknameInputLayout = styled.div`
  position: relative;
  width: fit-content;

  ${WarningText} {
    position: absolute;
    margin: 3px 0 0 3px;
  }
`;
