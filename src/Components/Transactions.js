import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import {Row, Col} from 'react-bootstrap';
import "./Css/Transactions.css";
import { db, auth } from "../firebase";
import ProductName from './ProductName';

function Transactions() {

    const [data,setData]= useState([]);
    const [name,setName]= useState([]);
    const [ids,setIDs]= useState([]);
    var i=0;

    useEffect(() => {
        
        const viewTransactions = async () => {
          const q = query(collection(db, "transactions"), where ("parent_id", "==",auth.currentUser.uid));
          const querySnaps = await getDocs(q);
          const updated = querySnaps.docs.map((doc) => doc.data()
          );
          setData(updated);
          console.log(data);
        }
        viewTransactions().catch(err => {
          console.error('error occured: ',err.message)
        });
        
        viewTransactions();
    
        }, []);

  return (
    <div className='transaction'>
        <meta name="viewport" content="width=device-width, initial-scale=1" ></meta>
    <div className='box'>
    <Row>
            <Col className='trans_header' xs={2}>
                <h2>Name</h2>
            </Col>
            <Col className='trans_header' xs={3}>
                <h2>Payment Date</h2>
            </Col>
            <Col className='trans_header' xs={3}>
                <h2>Item purchased</h2>
            </Col>
            <Col className='trans_header' xs={2}>
                <h2>Quantity</h2>
            </Col>
            <Col className='trans_header' xs={2}>
                <h2>Total Cost</h2>
            </Col>
        </Row>
    {data?.map((child) => ( 
        <Row>
        <Col xs={2}>
            <h2 className='trans_info col row'>{child.child_email}</h2>
        </Col>
        <Col xs={3}>
            <h2 className='trans_info'>{child.date.toDate().toString()}</h2>
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