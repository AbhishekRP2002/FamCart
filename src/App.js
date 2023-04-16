import React, {useState } from 'react';
import { BrowserRouter as Router,Routes as Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
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
    <div className="App">
      
      <Router>
      
      <div className="app">
        <Switch>
        <Route path="/transactions/:isChild" element={<><Navbar/><Transactions/></>}/>
        <Route path="/restrictions/:isChild/:childEmail" element={<><Navbar/><Restrictions/></>}/>
        <Route path="/details/:isChild" element={<><Navbar /><ParentHome/></>}/>
        <Route path="/addchild" element={<><Navbar /><AddChild /></>}/>
        <Route path='/expenditure/:childEmail' element ={<><Navbar/><Expenditure/></>}/>
        <Route path="/" element={<Login />}/>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
