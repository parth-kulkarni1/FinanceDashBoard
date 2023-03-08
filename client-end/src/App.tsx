import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap stylesheet
import {BrowserRouter, Route, Routes} from 'react-router-dom'

/* Import Trevor Library CSS Styling File */ 
import '@tremor/react/dist/esm/tremor.css';

/* Importing Components */
import Header from './Components/Header/Header';
import Dashboard from './Components/Dashboard/Dashboard';



function App() {
  return (

    <BrowserRouter>

      <Header />
      <Dashboard />
    
    
    </BrowserRouter>

  );
}

export default App;
