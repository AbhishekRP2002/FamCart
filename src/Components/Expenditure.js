import React, { useContext, useEffect, useState } from 'react';
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "./Css/Expenditure.css";
import arrow from './Css/Images/arrow.png'

function Expenditure()  {

 
    return (
        <div className='expenditurePage'>
            <div className='expAnalysis'>Expenditure Analysis
            <button className='pastMonth'>
                <img className='arrowImg'
                src={arrow}
                alt="arrow">
                </img>
                Past Month
            </button>
            </div>
            <button className="selectChild">Child's Name 
                <img
                className='arrowImg'
                src={arrow}
                alt="arrow">
                </img>
            </button>
            
        </div>
    );
}

export default Expenditure