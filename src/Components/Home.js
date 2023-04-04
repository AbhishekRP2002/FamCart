import React,{ useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase.js';
import "./Css/Home.css";
import {Row, Col, Button} from 'react-bootstrap';
import ProductCard from "./ProductCard";
import { doc, getDocs,query,collection} from "firebase/firestore"; 
import { db } from "../firebase.js";
function Home() {

let navigate = useNavigate();
const items = [{}];
const [productList, setProductList] = useState([]);
const user =  auth.currentUser;

useEffect(() => {
  if(user===null)
  navigate("/login")
  
  const viewProducts = async () => {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const updatedData = querySnapshot.docs.map((doc) => doc.data());
    setProductList(updatedData);
  }
  
  viewProducts();
  }, []);

  return (
    <>
    <div>
      <h1 align="center p-3" className="header">Welcome to the FamCard!</h1>
      <Row xs={1} md={3} className="g-4">
        {productList?.map((product,idx) => (
            <Col align="center" key={idx}>
            <ProductCard prod={product}/>
          </Col>
        ))}
      </Row>
    </div>
  </>
  );
}

export default Home;
