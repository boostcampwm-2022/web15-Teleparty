import styled from "styled-components";

const TransparencyLayout = styled.div`
  display: flex;
  width: fit-content;
  background-color: ${({ theme }) => theme.colors.primaryLightTransparent};
  border-radius: 10px;
  padding: 1rem;
  gap: 0.375rem;
  justify-items: center;
  align-items: center;
`;

const TransparencyRange = styled.input`
  appearance: none;
  width: 11.5rem;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.primaryLowTransparent};
  height: 0.25rem;
  border-radius: 5px;

  &::-webkit-slider-thumb {
    appearance: none;
    background-color: ${({ theme }) => theme.colors.primaryDark};
    width: 1.125rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
  &::-moz-range-thumb {
    appearance: none;
    border: none;
    background-color: ${({ theme }) => theme.colors.primaryDark};
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 50%;
  }
`;

const TransparencyCircle = styled.div<{ filled?: boolean }>`
  width: 1.375rem;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme, filled }) =>
    filled ? theme.colors.primary : theme.colors.primaryHighTransparent};
  aspect-ratio: 1/1;
`;

export { TransparencyLayout, TransparencyRange, TransparencyCircle };
