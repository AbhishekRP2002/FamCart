import React, {useState } from 'react';
import Home from "./Components/Home.js";
import { BrowserRouter as Router,Routes as Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {Container} from 'react-bootstrap';
import CartProvider from "./CartContext.js";
import Navbar from "./Components/Navbar.js";
import Login from "./Components/Login.js";
import './App.css';
import ParentHome from './Components/Parents/ParentHome.js';
import AddChild from './Components/Parents/AddChild.js';
import Transactions from './Components/Transactions.js';
import Restrictions from './Components/Restrictions.js';
import Expenditure from './Components/Expenditure.js';

function App() {

  return (
    <CartProvider>
    <div className="App">
      <Container>
      
      <Router>
      
      <div className="app">
        <Switch>
        <Route path="/login" element={<Login />}/>
        <Route path="/transactions" element={<><Navbar/><Transactions/></>}/>
        <Route path="/restrictions" element={<><Navbar/><Restrictions/></>}/>
        <Route path="/details" element={<><Navbar /><ParentHome/></>}/>
        <Route path="/addchild" element={<><Navbar /><AddChild /></>}/>
        <Route path='/expenditure' element ={<><Navbar/><Expenditure/></>}/>

        <Route path="/" element={<><Navbar/><Home/></>}/>
        
        </Switch>
      </div>
    </Router>
    </Container>
    </div>
    </CartProvider>
  );
}

export default App;
