import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap stylesheet
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/* Import Trevor Library CSS Styling File */
import '@tremor/react/dist/esm/tremor.css';

/* Importing Components */
import Home from 'Components/HomePage/Home';
import Footer from 'Components/Header/Footer';
import Header from './Components/Header/Header';
import Dashboard from './Components/Dashboard/Dashboard';
import TransactionIndividual from 'Components/TransactionIndividual/TransactionIndividual';
import TransactionInsight from 'Components/TransactionInsight/TransactionInsight';
import MonthlyGraphs from 'Components/MonthlyGraphs/MonthlyGraphs';
import { UpContextProvider } from 'Components/Context/UpContext';
import { UserContextProvider } from 'Components/Context/UserContext';
import PrivateRoutes from 'Components/PrivateRoutes/PrivateRoutes';
import CategoryInsight from 'Components/MonthlyCategory/MonthlyCategory';
import CategoriseTransaction from 'Components/TransactionIndividual/CategoriseTransaction';
import About from 'Components/AboutMe/AboutMe';

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <UpContextProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoutes><Dashboard /></PrivateRoutes>} />
            <Route path="/transaction/:transactionId" element={<PrivateRoutes><TransactionIndividual /></PrivateRoutes>} />
            <Route path="/transaction/insight/:transactionId" element={<PrivateRoutes><TransactionInsight /></PrivateRoutes>} />
            <Route path="/monthly-graphs/:transactionId" element={<PrivateRoutes><MonthlyGraphs /></PrivateRoutes>} />
            <Route path="/category/:monthId" element={<PrivateRoutes><CategoryInsight /></PrivateRoutes>} />
            <Route path="/transaction/categorise/:transactionId" element={<PrivateRoutes><CategoriseTransaction /></PrivateRoutes>} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </UpContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
