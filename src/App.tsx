import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateGift from './pages/CreateGift';
import OpenGift from './pages/OpenGift';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateGift />} />
        <Route path="/gift/:id" element={<OpenGift />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;