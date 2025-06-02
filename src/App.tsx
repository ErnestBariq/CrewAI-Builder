import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/layout/Header';
import Home from './pages/Home';
import TeamDetail from './pages/TeamDetail';
import { TeamProvider } from './context/TeamContext';

function App() {
  return (
    <TeamProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teams/:teamId" element={<TeamDetail />} />
              <Route path="/agents" element={<Home />} />
              <Route path="/tasks" element={<Home />} />
              <Route path="/settings" element={<Home />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TeamProvider>
  );
}

export default App;