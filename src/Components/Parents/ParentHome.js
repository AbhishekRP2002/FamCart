import React, { useContext, useEffect, useState } from 'react';
import {Button, Container, Navbar, Modal} from 'react-bootstrap';
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import Add from "../Css/Images/add.png";
import {Row, Col} from 'react-bootstrap';
import "../Css/ParentHome.css"
import Child from "../Css/Images/child.png";

function ParentHome() {

const [children, setChildren] = useState([]);
const [mail, setMail] = useState("");
const [name, setName] = useState("");
const [money, setMoney] = useState(0);
const [date, setDate] = useState([]);
var [ritems, setRItems] = useState([]);
const [amtToPay, setAmtToPay] = useState(0);
const [greeting, setGreeting] = useState('');

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
    

    const viewName = async () => {
      var docu = doc(db, "parents", auth.currentUser.uid);
          const docuSnap = await getDoc(docu);
        
            if (docuSnap.exists()) {
              const data = docuSnap.data();
              setName(data.username);
            } else {
              console.log('No matching documents.');
            }
    }

    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      setGreeting('Good morning, ');
    } else if (hour < 18) {
      setGreeting('Good afternoon, ');
    } else {
      setGreeting('Good evening, ');
    }

    viewChildren();
    viewName();
    }, []);
  return (
    <>
    <div className='parentHome'>
      <Row>
        <Col>
          <h1 className='greeting'>{greeting}{name}</h1>
          {children?.map((child) => (
                <Col sm={9}>
                <Button variant="outlined" color="secondary" className='childDetails' onClick={() => {
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
                  <div className='onechild'>
                  <div className='imgpart'>
                  <img className= 'child-img' src={Child} />
                  </div>
                  <div className='otherpart'>
                  <h1 className='name'>{child.child_username}</h1>
                  <h3 className='email'>{child.child_email}</h3>
                  </div>
                  </div>
                  </Button>
                  {
                  ((showChild===true)&&(child.child_email===mail))&&
                  < div className='moreInfo'>
                    < div className='forSpace'>
                    <h2 className='info'>Balance:</h2>
                    <h2 className='info'>{money}</h2>
                    </div>
                    < div className='forSpace'>
                    <h2 className='info'>Last Date Of Transaction:</h2><h2 className='info'>{date.toString()}</h2>
                    </div>
                    < div className='forSpace restrictedPart'>
                    <h2 className='info'><img className= 'add' src={Add} />Restricted items:</h2><h2 className='info'> {ritems?.map((item,idx) => (
                    <span key={idx}  className='info'>{item} </span>
                  ))}</h2>
                  </div>
                  <div>
                  {(showAmt===false)&&<Button  variant="outlined" color="secondary" onClick={()=>{
                      setShowAmt(true)
                    }}  className="amtBtn">Add Amount</Button>}
                  {(showAmt===true)&&
                  <div classNam="amtPart">
                      <Button  variant="outlined" color="secondary" className="amtBtn">Add Amount</Button>
                      <div classNam="toPay">
                        <input className="input" onChange={(e) => setAmtToPay(e.target.value)} type="number"/>
                        <Button className='payBtn'>Pay</Button>
                      </div>
                  </div>
                  }
                  </div>
                  </div>
                  }
              </Col>
          ))}
          {(children.length===0)&&
          <h3 className='noChild'>No child added</h3>
          }
        </Col>

        <Col sm={3} className='addChild'>
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