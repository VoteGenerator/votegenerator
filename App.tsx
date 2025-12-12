import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PollCreator from './components/PollCreator';
import PollView from './components/PollView';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PollCreator />} />
        <Route path="/poll/:id" element={<PollView />} />
      </Routes>
    </HashRouter>
  );
};

export default App;