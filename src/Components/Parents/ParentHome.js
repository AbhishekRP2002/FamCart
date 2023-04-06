import React, { useContext, useEffect, useState } from 'react';
import {Button, Container, Navbar, Modal} from 'react-bootstrap';
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import Add from "../Css/Images/Add.png";
import {Row, Col} from 'react-bootstrap';
import "../Css/ParentHome.css"

function ParentHome() {

const [children, setChildren] = useState([]);
const [mail, setMail] = useState("");
const [money, setMoney] = useState(0);
const [date, setDate] = useState([]);
var [ritems, setRItems] = useState([]);
const [amtToPay, setAmtToPay] = useState(0);

var [ritemIDs, setRitemIDs] = useState([]);
const [showChild,setShowChild] = useState(false);
const [showAmt, setShowAmt] = useState(false);
let navigate = useNavigate();

const openChildDetails = async (email) => {
  setShowChild(false)
  ritems = [];
  const qu = query(collection(db, "children"), where ("email", "==",email));
  const querySnap = await getDocs(qu);

    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      const data = doc.data();
      setMoney(data.balance)
    } else {
      console.log('Nopee');
    }
}

const lastTransactionDate = async (email) => {
  setShowChild(false)
  const docRef = doc(db, "transactions", email);
  const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dateData = docSnap.data().date.toDate();
      setDate(dateData);
    } else {
      console.log('No matching documents.');
    }
}

const getProductNames = async(ID) => {
  var x = ID.toString();
    var docu = doc(db, "products", x);
    const docuSnap = await getDoc(docu);
  
      if (docuSnap.exists()) {
        const dataR = docuSnap.data();
        var name=dataR.title;
        return name;
      } else {
        console.log('No matching documents.');
        return null;
      }
}

const splitID = async(ritemids) => {
  const promises = ritemids.map(n => getProductNames(n));
  const names = await Promise.all(promises);
  setRItems([...ritems,...names.filter(n => n !== null)])
}

const showRestricted = async (email) => {
  
  var docRef = doc(db, "restrictions", email);
  const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
          setRitemIDs(data.product_id);
          const id = data.product_id;
          console.log("hiii"+id);
          splitID(id);
      } else {
        console.log('No matching documents.');
      }
}

const showChildBalance = () => setShowChild(true);
const closeChildBalance = () => {
  setShowChild(false);
  setShowAmt(false);
  setRitemIDs([]);
  ritems = [];
}


  useEffect(() => {
    
    const viewChildren = async () => {
      const q = query(collection(db, "link"), where ("parent_id", "==",auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const updatedData = querySnapshot.docs.map((doc) => doc.data());
      setChildren(updatedData)
    }
    viewChildren().catch(err => {
      console.error('error occured: ',err.message)
    });
    
    viewChildren();

    }, []);
  return (
    <>
    <div className='parentHome'>
      <Row>
        <Col>
          <h1>Good Morning, User</h1>
          {children?.map((child) => (
                <Col sm={12}>
                <Button className='childDetails' onClick={() => {
                  openChildDetails(child.child_email)
                  setMail(child.child_email)
                  lastTransactionDate(child.child_email)
                  showRestricted(child.child_email)
                  if(showChild===false)
                  {
                    ritems = [];
                    setRitemIDs([])
                    setRItems([])
                    setTimeout(showChildBalance, 500);
                  }
                  else if(child.child_email===mail)
                  {
                    ritems = [];
                    setRitemIDs([])
                    setRItems([])
                    setTimeout(closeChildBalance, 500);
                  }
                  else{
                    ritems = [];
                    setRitemIDs([])
                    setTimeout(showChildBalance, 500);
                  }
                  }}>
                  <h1 className='name'>{child.child_username}</h1>
                  <h3 className='email'>{child.child_email}</h3>
                  </Button>
                  {
                  ((showChild===true)&&(child.child_email===mail))&&
                  < div className='moreInfo'><span>Balance:</span>
                  <span>
                  {money}
                  </span>
                  <h2>Last Date Of Transaction={date.toString()}</h2>
                  <h2>Restricted items: {ritems?.map((item,idx) => (
                      <span key={idx}>{item} </span>
                  ))}</h2>
                  <Button onClick={()=>{
                      setShowAmt(true)
                    }}>Add Amount</Button>
                  {(showAmt===true)&&
                  <>
                      <input className="input" onChange={(e) => setAmtToPay(e.target.value)} type="number"/>
                      <Button>Pay</Button>
                  </>
                  }
                  </div>
                  }
              </Col>
          ))}
        </Col>

        <Col sm={6} className='addChild'>
        <h1>Add Child </h1>
        <Link to='/addchild'>
          <img className= 'add' src={Add} />
          </Link>
        </Col>
        </Row>
    </div>
    
    </>
  )
}

export default ParentHome