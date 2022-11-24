import styled from "styled-components";

const Header = styled.span`
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme: { colors } }) => colors.primary};
  color: ${({ theme: { colors } }) => colors.white};
  font-size: 32px;
  font-weight: 700;
  padding: 0.75rem;
  text-align: center;
  margin-bottom: 0.75rem;
`;

export { Header };
