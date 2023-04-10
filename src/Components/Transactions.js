import React, { useState, useContext, useEffect } from 'react';
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import {Row, Col} from 'react-bootstrap';
import "./Css/Transactions.css";
import { db, auth } from "../firebase";
import ProductName from './ProductName';
import { CartContext } from '../CartContext.js';

function Transactions() {

    const [data,setData]= useState([]);
    const [name,setName]= useState([]);
    const [ids,setIDs]= useState([]);
    const [isLoaded,setIsLoaded]= useState(false);  
    const [isChild,setIsChild]= useState(false);      
    
        const checkChild = async () => {
        const docRef = doc(db, "children", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("isChild yayyy!")
            setIsChild(true);
        } else {
            console.log("parenttt")
            setIsChild(false);
        }
    }

    useEffect(() => {
        setIsLoaded(false)
        const checkChild = async () => {
            const docRef = doc(db, "children", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("isChild yayyy!")
                setIsChild(true);
            } else {
                console.log("parenttt")
                setIsChild(false);
            }
        }

        const viewTransactions = async () => {


            var q = "";
    
            if(isChild)
            {
              q = query(collection(db, "transactions"), where ("child_email", "==",auth.currentUser.email));
            }
            else
            {
              q = query(collection(db, "transactions"), where ("parent_id", "==",auth.currentUser.uid))
            }
            const querySnaps = await getDocs(q);
            const updated = querySnaps.docs.map((doc) => doc.data()
            );
            setData(updated);
          }

        setIsLoaded(true)
        console.log("check done")

        checkChild()
        if(isLoaded)
        viewTransactions()
        },[isLoaded]);

if(!isLoaded)
return null;

  return (
    <div className='transaction'>
        <meta name="viewport" content="width=device-width, initial-scale=1" ></meta>
    <div className='box'>
    <Row>
            {!(isChild)&&<Col className='trans_header'>
                <h2>Name</h2>
            </Col>}
            <Col className='trans_header'>
                <h2>Payment Date</h2>
            </Col>
            <Col className='trans_header'>
                <h2>Item purchased</h2>
            </Col>
            <Col className='trans_header'>
                <h2>Quantity</h2>
            </Col>
            <Col className='trans_header'>
                <h2>Total Cost</h2>
            </Col>
        </Row>
    {data?.map((child) => ( 
        <Row>
        {(!isChild)&&<Col>
            <h2 className='trans_info col row'>{child.child_email}</h2>
        </Col>}
        <Col xs={3}>
             <h2 className='trans_info'>{child.date.toDate().toString()}</h2> {/* //change in firebase */}
        </Col>
        <Col xs={3}>
            <h2><ProductName className='trans_info' id={child.product_id} nameIsOne="1" quantity={child.quantity}/></h2>
        </Col>
        <Col xs={2}>
            <h2 className='trans_info'>{child.quantity}</h2>
        </Col>
        <Col xs={2}>
            <h2><h2><ProductName className='trans_info' id={child.product_id} nameIsOne="0"  quantity={child.quantity}/></h2></h2>
        </Col>
    </Row>
    ))}
    </div>
    </div>
  )
}

export default Transactions