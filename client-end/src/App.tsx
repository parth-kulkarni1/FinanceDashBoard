import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap stylesheet
import {BrowserRouter, Route, Routes} from 'react-router-dom'

/* Import Trevor Library CSS Styling File */ 
import '@tremor/react/dist/esm/tremor.css';

/* Importing Components */

import Home from 'Components/HomePage/Home';
import Footer from 'Components/Header/Footer';

import Header from './Components/Header/Header';
import Dashboard from './Components/Dashboard/Dashboard';
import TransactionIndividaul from 'Components/TransactionIndividual/TransactionIndividual';
import TransactionInsight from 'Components/TransactionInsight/TransactionInsight';
import { UpContextProvider } from 'Components/Context/UpContext';
import { UserContextProvider } from 'Components/Context/UserContext';



function App() {
  return (

    <BrowserRouter>

    <UserContextProvider>
    <UpContextProvider>
      <Header />

      <Routes>

        <Route path = "/" element = {<Home />}></Route>
        <Route path = "/dashboard" element = {<Dashboard />}></Route>
        <Route path = "/transaction/:transactionId" element = {<TransactionIndividaul />}></Route>
        <Route path = "/transaction/insight/:transactionId" element = {<TransactionInsight />}></Route>

      </Routes>

    </UpContextProvider>

    <Footer />

    </UserContextProvider>

 
    
    </BrowserRouter>

  );
}

export default App;
