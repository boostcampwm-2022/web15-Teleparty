import styled from "styled-components";

interface ChatRowProps {
  isMine?: boolean;
}

export interface ChatTextProps extends ChatRowProps {
  isFirst?: boolean;
}

const ChatLayout = styled.div`
  width: 18rem;
  height: 31rem;
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.primaryLightTransparent};
  border-radius: 25px 25px 0 0;
  box-shadow: ${({ theme: { shadows } }) => shadows.medium};
  overflow: scroll;
  & > * + * {
    margin-top: 0.5rem;
  }
`;

const ChatRow = styled.div<ChatRowProps>`
  display: flex;
  width: 100%;
  justify-content: ${({ isMine }) => (isMine ? "right" : "left")};
  align-items: flex-start;
  gap: 0.25rem;
`;

const ChatTextLayout = styled.div<{ isFirst?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-left: ${({ isFirst }) => (!isFirst ? "2.75rem" : "")};
`;

const ChatText = styled.span<ChatTextProps>`
  width: fit-content;
  max-width: ${({ isMine }) => (isMine ? "15rem" : "13rem")};
  box-shadow: ${({ theme: { shadows } }) => shadows.medium};
  padding: 1rem;
  border-radius: ${({ isFirst, isMine }) =>
    isFirst ? (isMine ? "20px 0 20px 20px" : "0 20px 20px 20px") : "20px"};
  background-color: ${({ theme: { colors }, isMine }) =>
    isMine ? colors.primaryDark : colors.primaryLight};
  color: ${({ isMine, theme: { colors } }) =>
    isMine ? colors.white : colors.primaryDark};
`;

const ChatUsernameText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme: { colors } }) => colors.white};
`;

const ChatInputForm = styled.form`
  width: 18rem;
  padding: 1rem;
  background-color: ${({ theme: { colors } }) => colors.primaryLight};
  border-radius: 0 0 25px 25px;
  box-shadow: ${({ theme: { shadows } }) => shadows.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export {
  ChatLayout,
  ChatRow,
  ChatUsernameText,
  ChatText,
  ChatInputForm,
  ChatTextLayout,
};
