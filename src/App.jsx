import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import Paths from './routes/routes';




import './App.css';
import Navbar from './components/Nvbar';





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
