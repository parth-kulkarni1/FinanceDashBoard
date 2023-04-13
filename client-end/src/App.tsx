import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap stylesheet
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'

/* Import Trevor Library CSS Styling File */ 
import '@tremor/react/dist/esm/tremor.css';

/* Importing Components */
import Header from './Components/Header/Header';
import Dashboard from './Components/Dashboard/Dashboard';
import TransactionIndividaul from 'Components/TransactionIndividual/TransactionIndividual';
import { UpContextProvider } from 'Components/Context/UpContext';



function App() {
  return (

    <BrowserRouter>
    <UpContextProvider>
      <Header />

      <Routes>

        <Route path = "/" element = {<Dashboard />}></Route>
        <Route path = "/transaction/:transactionId" element = {<TransactionIndividaul />}></Route>

      </Routes>

    </UpContextProvider>
 
    
    </BrowserRouter>

  );
}

export default App;
