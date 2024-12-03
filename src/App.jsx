import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import Paths from './routes/routes';
import Navbar from './components/Nvbar';
import './App.css';

function App() {
  
  return (
    <>
      <Router>
        <Navbar />
        <Paths />
      </Router>
    </>
  );
}

export default App;
