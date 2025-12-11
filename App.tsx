import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import CreatePoll from './components/CreatePoll';
import PollView from './components/PollView';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<PollView />} />
      </Routes>
    </HashRouter>
  );
};

export default App;