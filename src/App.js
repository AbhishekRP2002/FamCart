import React, {useState } from 'react';
import Home from "./Components/Home.js";
import { BrowserRouter as Router,Routes as Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {Container} from 'react-bootstrap';
import CartProvider from "./CartContext.js";
import Navbar from "./Components/Navbar.js";
import Success from "./Components/Success.js";
import Cancel from "./Components/Cancel.js";
import Login from "./Components/Login.js";
import './App.css';
import ParentHome from './Components/Parents/ParentHome.js';
import ChildHome from './Components/Child/ChildHome.js';
import AddChild from './Components/Parents/AddChild.js';
import Transactions from './Components/Transactions.js';



function App() {

  return (
    <CartProvider>
    <div className="App">
      <Container>
      
      <Router>
      
      <div className="app">
        <Switch>
        <Route path="/login" element={<Login />}/>
        <Route path="/success" element={<><Navbar/><Success/></>}/>
        <Route path="/cancel" element={<><Navbar/><Cancel/></>}/>
        <Route path="/transactions" element={<><Navbar/><Transactions/></>}/>
        <Route path="/parent" element={<><Navbar /><ParentHome/></>}/>
        <Route path="/addchild" element={<><Navbar /><AddChild /></>}/>
        <Route path="/child" element={<><Navbar /><ChildHome /></>}/>

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
