import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 5px;
  padding: 20px;
  border: 1px solid #ebae37;
  border-radius: 10px solid;
`;

export default function FloatingElement({
  style = undefined,
  children,
  stretchVertical = false,
}) {
  return (
    <Wrapper
      style={{
        height: stretchVertical ? 'calc(100% - 10px)' : undefined,
        ...style,
      }}
    >
      {children}
    </Wrapper>
  );
}
