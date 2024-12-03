// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/Dashboard'; // Import Dashboard
import AddSong from './components/AddSong';  // Trang thêm bài hát

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-song" element={<AddSong />} />  {/* Route cho form thêm bài hát */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
