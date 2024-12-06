import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import Paths from './routes/Routes.jsx';
import Navbar from './components/Navbar';
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
