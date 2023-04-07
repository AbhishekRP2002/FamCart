import React, { useEffect, useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import "./Css/restrictions.css";
import { Link } from 'react-router-dom';
import { db, auth } from "../firebase";
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import Add from "./Css/Images/add.png";

function Restrictions() {

  const [data,setData]= useState([]);
  var quantity = [];

  const showProducts = () => {

    const isDivisibleBy3 = (i + 1) % 3 === 0;
    const rowClass = isDivisibleBy3 ? 'product-row' : '';
    const productElements = [];

    for(var i=0; i<data.length; ++i)
      quantity[i] = 0;
    for (let i = 0; i < data.length; i++) {
        productElements.push(
          <div key={i} className={`rproduct ${rowClass}`}>
            <div className='image-wrapper'>
            <img className="cropped-image" src={data[i].img}/>
            </div>
            <h3 className='dataTitle'>{data[i].title}</h3>
            <div className='quantityAdd'>
            <h4>Quantity</h4>
            <h3>{quantity[i]}</h3>
            <img className='add' src={Add} />
          </div>
          </div>
        );
    }
    return productElements;
  }

  const viewAll = async () => {
    const q = query(collection(db, "products"));
    const querySnaps = await getDocs(q);
    const updated = querySnaps.docs.map((doc) => doc.data()
    );
    setData(updated);

  }

  const viewSome = async (type) => {
    const q = query(collection(db, "products"), where ("category","==",type));
    const querySnaps = await getDocs(q);
    const updated = querySnaps.docs.map((doc) => doc.data()
    );
    setData(updated);

  }

  return (
    <div className='restrictionPage'>
      <Row className='restriction'>
        <Col className='sideNav'>
          <h2 className='category'>Category</h2>
          <div className='Rbtns'>
          <Button className='Rbtn' onClick={() => viewAll() }>View All</Button>
          <Button className='Rbtn' onClick={() => viewSome("medicines") }>Medicines</Button>
          <Button className='Rbtn' onClick={() => viewSome("junk") }>Junk</Button>
          <Button className='Rbtn' onClick={() => viewSome("dairy") }>Dairy Products</Button>
          <Button className='Rbtn' onClick={() => viewSome("nuts") }>Nuts</Button>
          </div>
        </Col>
        <Col className='productPart'>
        <div className='AllProducts'>
        <div className='Rproduct '>
          {showProducts()}
        </div>
        </div>
        </Col>
      </Row>
    </div>
  )
}

export default Restrictions

// {
//   (() => {
//     for (let i = 0; i < data.length; i++) {
//         <div className='Rproduct'>
//         <h2>{data[i].title}</h2>
//         <h2>{quantity[i]}</h2>
//         </div>
//     }

//   })()
// }