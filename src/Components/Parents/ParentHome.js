import React, { useContext, useEffect, useState, useCallback } from 'react';
import {Button, Container, Navbar, Modal} from 'react-bootstrap';
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import Add from "../Css/Images/add.png";
import {Row, Col} from 'react-bootstrap';
import "../Css/ParentHome.css"
import Child from "../Css/Images/child.png";
import notifs from "../Css/Images/notifs.png";
import Payment from "../Payment.js"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';

function ParentHome() {
const [request,setRequests]= useState([]);

const { isChild } = useParams();
const [children, setChildren] = useState([]);
const [mail, setMail] = useState("");
const [name, setName] = useState("");
const [money, setMoney] = useState(0);
const [date, setDate] = useState([]);
const [rQuantity, setRQuantity] = useState([]);
var [ritems, setRItems] = useState([]);
const [amtToPay, setAmtToPay] = useState(0);
const [greeting, setGreeting] = useState('');
const [childId,setChildId] = useState("");
const [showChild,setShowChild] = useState(false);
const [showChildBalanceAmt,setShowChildBalanceAmt] = useState(false);
const [showStripe,setShowStripe] = useState(false);  
const [showAmt, setShowAmt] = useState(false);
const [requestPlaced, setRequestPlaced] = useState(false);
const [isLoaded,setIsLoaded] = useState(false);

const PUBLIC_KEY = "pk_test_51L53qSSJjdtRfZfqeUz2kHr28deqaXpP543D5Sj7M9ePyjE4A10csiK44F6Tx33iv7IB8W5PA8OpgKIXjcRm82xT002KPdgFvn"
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const openChildDetails = async (email) => {
  setShowChild(false)
  ritems = [];
  const qu = query(collection(db, "children"), where ("email", "==",email));
  const querySnap = await getDocs(qu);

    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      setChildId(doc.id)
      const data = doc.data();
      setMoney(data.balance)
      console.log(money)
    } else {
      console.log('No child found.');
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
          const id = data.product_id;
          console.log("hiii"+id);
          setRQuantity(data.quantity)
          splitID(id);
      } else {
        console.log('No matching documents.');
      }
}

const showChildBalance = () => setShowChild(true);
const closeChildBalance = () => {
  setShowChild(false);
  setShowAmt(false);
  setShowStripe(false)
  ritems = [];
}

const addToRequest = async() => {
  await setDoc(doc(db, "requests", auth.currentUser.email), {
    email: auth.currentUser.email,
    amt:amtToPay
  });
}

  useEffect(() => {
    
    
    const viewChildren = async () => {
      var q = "";
      if(isChild.toString()==="false")
      {
        q = query(collection(db, "link"), where ("parent_id", "==",auth.currentUser.uid));
      }
      else
      {
        q = query(collection(db, "link"), where ("child_email", "==",auth.currentUser.email));
      }
      const querySnapshot = await getDocs(q);
      const updatedData = querySnapshot.docs.map((doc) => doc.data());
      setChildren(updatedData)
    }
    viewChildren().catch(err => {
      console.error('error occured: ',err.message)
    });
    

    const viewName = async () => {
      var docu ="";
      ((isChild.toString()==="true")
      ? docu = doc(db, "children", auth.currentUser.uid)
      :docu = doc(db, "parents", auth.currentUser.uid))
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
    setIsLoaded(false)
    viewName();
    viewChildren();
    setIsLoaded(true)
    }, []);

    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, 'requests'));
      const docs= querySnapshot.docs.map((doc) => ({id: doc .id, ...doc.data()}));
      setRequests(docs);
    };

  if(isLoaded===false)
  {
    return null;
  }
  return (
    <>
    <div className='parentHome'>
      <div className='header'>
        <h1 className='greeting'>{greeting}{name}</h1>
        {(isChild.toString()==="true")&&
        (showChildBalanceAmt===true)&&
        <h2 className='balanceHeader'>Balance : Rs. {money}</h2>
        }
      </div>
        <div className='rowPart'>
          <div className='col1'>
          {children?.map((child) => (
            <>
                  <Col>
                  <Button variant="outlined" color="secondary" className='childDetails' onClick={() => {
                    openChildDetails(child.child_email)
                    setMail(child.child_email)
                    lastTransactionDate(child.child_email)
                    showRestricted(child.child_email)
                    setShowChildBalanceAmt(true)
                    if(showChild===false)
                    {
                      ritems = [];
                      setRItems([])
                      setShowStripe(false)
                      setShowAmt(false)
                      setRequestPlaced(false)
                      setTimeout(showChildBalance, 500);
                    }
                    else if(child.child_email===mail)
                    {
                      ritems = [];
                      setRItems([])
                      setShowStripe(false)
                      setShowAmt(false)
                      setRequestPlaced(false)
                      setTimeout(closeChildBalance, 500);
                    }
                    else{
                      ritems = [];
                      setShowStripe(false)
                      setShowAmt(false)
                      setRequestPlaced(false)
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
                      {(isChild.toString()==="false")&&
                        <div className='forSpace'>
                        <h2 className='info'>Balance:</h2>
                        <h2 className='info'>{money}</h2>
                        </div>
                      }
                      < div className='forSpace'>
                      <h2 className='info'>Last Date Of Transaction:</h2><h2 className='info'>{date.toString()}</h2>
                      </div>
                      < div className='forSpace restrictedPart'>
                      <h2 className='info'>{(isChild.toString()==="false")&&
                      <Link className='' to={`/restrictions/${isChild}/${child.child_email}`}><img className= 'add' src={Add} /></Link>}
                      Restricted(quantity):</h2><h2 className='info'> {ritems?.map((item,idx) => (
                      <span key={idx}  className='info'>{item}({rQuantity[idx]}) </span>
                    ))}</h2>
                    </div>
                    <div>
                    {(isChild.toString()==="true")
                      ?<>
                      {(showAmt===false)&&
                        <Button  variant="outlined" color="secondary" onClick={()=>{
                          setShowAmt(true)
                        }}  className="amtBtn">Request Amount
                        </Button>}

                        {(showAmt===true)&&
                          <div classNam="amtPart">
                              <Button  variant="outlined" color="secondary" className="amtBtn">Request Amount</Button>
                              <div classNam="toPay">
                                <input className="inputPart" onChange={(e) => setAmtToPay(e.target.value)} type="number"/>
                                <Button className='payBtn' onClick={()=> {addToRequest(true);setRequestPlaced(true)}}>Request</Button>
                              </div>
                          </div>
                        }
                        {(requestPlaced===true)&&
                          <div className="requestPlaced">
                              <Alert key="success" variant="success">
                              Your request has been sent.
                              </Alert>
                          </div>
                        }
                    </>
                    :<>
                        {(showAmt===false)&&
                          <Button  variant="outlined" color="secondary" onClick={()=>{
                              setShowAmt(true)
                              setShowStripe(false)
                            }}  className="amtBtn">Add Amount
                          </Button>}

                        {(showAmt===true)&&
                          <div classNam="amtPart">
                              <Button  variant="outlined" color="secondary" className="amtBtn">Add Amount</Button>
                              <div classNam="toPay">
                                <input className="inputPart" onChange={(e) => setAmtToPay(e.target.value)} type="number"/>
                                <Button className='payBtn' onClick={()=> setShowStripe(true)}>Pay</Button>
                                {showStripe&&
                                <Elements stripe={stripeTestPromise}>
                                <Payment amt={amtToPay} id={childId} />
                                </Elements>}
                              </div>
                          </div>
                        }
                    </>
                    }   
                    </div>
                    </div>
                    }
                </Col>
            {(isChild.toString()==="false")&&
              (children.length===0)&&
              <h3 className='noChild'>No child added</h3>
            }
            </>))}
          </div>

        <div className='addChild'>
        {(isChild.toString()==="false")&&
         <>
           <h1>Add Child </h1>
            <Link to='/addchild'>
              <img className= 'add' src={Add} />
            </Link>
          <img
          className='notifs-icon'
          src={notifs}
          onClick={() => {
            fetchRequests()
          }}></img>
          <div className='requests'>
            {request.map((item) => (

              <div className='request-list' key={item.id}>
                <h3> {item.email}</h3>
                <h3>Amount Requested: {item.amt}</h3>

              </div>
            ))}
          </div>
          </>
         }
        </div>
        </div>
    </div>
    
    </>
  )
}

export default ParentHome