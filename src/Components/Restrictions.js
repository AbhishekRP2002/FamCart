import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Alert } from 'react-bootstrap'
import "./Css/restrictions.css";
import { Link, useParams } from 'react-router-dom';
import { db, auth } from "../firebase";
import { doc, setDoc, collection, query, where, getDocs,getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Add from "./Css/Images/add.png";

function Restrictions() {

  const [data,setData]= useState([]);
  const [parent_id,setParent_id]= useState("");
  const [quantity,setQuantity] = useState(0)
  const [changeBalance,setChangeBalance] = useState(false);
  const [restrictionExists,setRestrictionExists] = useState(false);
  const [newRestriction,setNewRestriction] = useState(false);
  const { isChild, childEmail } = useParams();
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showAlert,setShowAlert] = useState(false)

  const addRestrictions = async (id) => {
    const docu = doc(db, 'restrictions', childEmail);
    const docuSnap = await getDoc(docu);
    const data = docuSnap.data();
    console.log("quantity and pr id are" + quantity+" "+ id)
    const q = data.quantity
    console.log(q)
    q.push(parseInt(quantity,10));
    console.log("new"+q)
    if (data.product_id.includes(id)) {
      setRestrictionExists(true)
    } else {
      setNewRestriction(true)
      await updateDoc(docu, {
        product_id: arrayUnion(id),
        quantity: q
      });
    }
    }

  const getProductPrice = async (id) => {
    const docu = doc(db, 'products', id.toString());
    const docuSnap = await getDoc(docu);
    
    if (docuSnap.exists()) {
      const dataR = docuSnap.data();
      return dataR.price;
    } else {
      console.log('No matching documents.');
      return undefined;
    }
  }

    const toDecreaseBalance = async(id) => {
    const price= await getProductPrice(id);
  
    const docu = doc(db, "children", auth.currentUser.uid)
            const docuSnap = await getDoc(docu);
              if (docuSnap.exists()) {
                const bal = docuSnap.data().balance;
                const tot = price*quantity;
                const newBalance = bal - tot;
                if(newBalance>=0)
                {
                  setBalance(newBalance);
                  setShowAlert(true);
                  await updateDoc(docu, {
                    balance: newBalance
                  });
                }
                else
                {
                  setInsufficientBalance(true)
                }
  
              } else {
                console.log('No matching documents.');
              }
  }

    const addToDB = async (i) => {
    setChangeBalance(true)
    toDecreaseBalance(i)
    let now = Date.now()+auth.currentUser.email;
    const date = new Date();
    await setDoc(doc(db, "transactions", now), {
      parent_id: parent_id,
      date: date,
      child_email: auth.currentUser.email,
      product_id:i,
      quantity: quantity
    });
  }

  const showProducts = () => {

    const productElements = [];

    for (let i = 0; i < data.length; i++) {
        productElements.push(
          <div key={i} className={`rproduct product-row`}>
            <div className='image-wrapper'>
            <img className="cropped-image" src={data[i].img}/>
            </div>
            <h3 className='dataTitle'>{data[i].title}</h3>
            <div className='quantityAdd'>
            <h4>Quantity</h4>
            <input className='inputbox' onChange={(e) => setQuantity(e.target.value)} type="number"/>
            <button className="noBtn" onClick={()=>{
              if(isChild.toString()==="true")
              {
                addToDB(data[i].id)
              }
              else {
                addRestrictions(data[i].id)
              }
              }}><img className='add' src={Add} /></button>
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

  useEffect(() => {
      
    if(isChild.toString()==="true")
    {
      const find_parent_id = async () => {
        const docu = doc(db, "link", auth.currentUser.email);
        const docuSnap = await getDoc(docu);
              if (docuSnap.exists()) {
                const info = docuSnap.data();
                setParent_id(info.parent_id);
              } else {
                console.log('No matching documents.');
              }
      }

    find_parent_id();
    const balancePart = async() => {
      const docu = doc(db, "children", auth.currentUser.uid)
      const docuSnap = await getDoc(docu);
          if (docuSnap.exists()) {
              console.log("the balance issss" + docuSnap.data().balance)
              setBalance(docuSnap.data().balance);
            }
    }
    balancePart()
    }
    else
    {
       
    }
    showProducts();
  },[]);

  return (
    <div className='restrictionPage'>
          <div className='categoryPhone Rbtns'>
          <Button className='Rbtn' onClick={() => viewAll() }>View All</Button>
          <Button className='Rbtn' onClick={() => viewSome("medicines") }>Medicines</Button>
          <Button className='Rbtn' onClick={() => viewSome("junk") }>Junk</Button>
          <Button className='Rbtn' onClick={() => viewSome("dairy") }>Dairy Products</Button>
          <Button className='Rbtn' onClick={() => viewSome("nuts") }>Nuts</Button>
          </div>
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
          <br />
        {(showAlert)&&
          <>
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>Product purchased!</Alert.Heading>
        </Alert>
          </>}
          {(insufficientBalance)&&
          <>
          <Alert variant="danger" onClose={() => setInsufficientBalance(false)} dismissible>
          <Alert.Heading>Insufficient balance</Alert.Heading>
        </Alert>
          </>}
          {(restrictionExists)&&
          <>
          <Alert variant="danger" onClose={() => setRestrictionExists(false)} dismissible>
          <Alert.Heading>Product restriction already set</Alert.Heading>
        </Alert>
          </>}
          {(newRestriction)&&
          <>
          <Alert variant="success" onClose={() => setNewRestriction(false)} dismissible>
          <Alert.Heading>Product restriction added</Alert.Heading>
        </Alert>
          </>}
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