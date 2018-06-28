import React from 'react';
import styled from 'react-emotion';
import { BrowserRouter } from 'react-router-dom';

import Sidebar from './components/Sidebar';

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const Container = styled('div')`
  background-color: blue;
  width: 100%;
  height: 100%;
`;

export default function App() {
  return (
    <BrowserRouter>
      <Wrapper>
        <Sidebar />
        <Container />
      </Wrapper>
    </BrowserRouter>
  );
}
