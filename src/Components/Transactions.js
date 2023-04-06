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

    const getProductNames = async(ID) => {
        var x = ID.toString();
          var docu = doc(db, "products", x);
          const docuSnap = await getDoc(docu);
        
            if (docuSnap.exists()) {
              const dataR = docuSnap.data();
              setName(...name,dataR.title);
              return name;
            } else {
              console.log('No matching documents.');
              return null;
            }
      }

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
            <Col xs={2}>
                <h2>Child's Name</h2>
            </Col>
            <Col xs={3}>
                <h2>Date of Transaction</h2>
            </Col>
            <Col xs={3}>
                <h2>Item purchased</h2>
            </Col>
            <Col xs={2}>
                <h2>Quantity</h2>
            </Col>
            <Col xs={2}>
                <h2>Total Cost</h2>
            </Col>
        </Row>
    {data?.map((child) => ( 
        <Row>
        <Col xs={2}>
            <h5>{child.child_email}</h5>
        </Col>
        <Col xs={3}>
            <h2>{child.date.toDate().toString()}</h2>
        </Col>
        <Col xs={3}>
            <h2><ProductName id={child.product_id}/></h2>
        </Col>
        <Col xs={2}>
            <h2>{child.quantity}</h2>
        </Col>
        <Col xs={2}>
            <h2>Total Cost</h2>
        </Col>
    </Row>
    ))}
    </div>
    </div>
  )
}

export default Transactions