import React,{ useState, useEffect, useContext} from 'react';
import {Button, Container, Modal} from 'react-bootstrap';
//you need to also add bootstrap link in the app.js page or here
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc,getDocs,collection,where,query} from "firebase/firestore"; 
import { db, auth } from '../firebase.js';
import "./Css/Navbar.css"
import Profile from "./Css/Images/profile.png"
import Logo from "./Css/Images/logo.png"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {

    const [isLoaded, setIsLoaded] = useState(false);
    const [isChild, setIsChild] = useState(false);

    useEffect(() => {
      const checkChild = async () => {
        const docRef = doc(db, "children", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setIsChild(true);
        } else {
            setIsChild(false);
        }
    }

      setIsLoaded(false)
      checkChild()
      setIsLoaded(true)
  },[])

  if(isLoaded===false)
  {
    return null;
  }

  return (
    <>
    <div className="nav-bar">
            <Link className='logoimg' to={`/details/${isChild}`}><img 
            className="main-logo"
            src={Logo}
            alt="logo"
            ></img></Link>
            
            <div className='nav-right'>
            {!(isChild) ?<div>
            </div>:<div className='link'>
            <Link className="links link1" to={`/restrictions/${isChild}/${auth.currentUser.email}`}>Shop</Link>
            </div>}
            <div className='link'>
            <Link className="links link2" to={`/transactions/${isChild}`}>Transactions</Link>
            </div>
            {/* {(isChild)&&<div className='link'>
            <Link className="links " to="/expenditure">Expenditure</Link>
            </div>} */}
            <div className="profile link3">
                <Link className='profileLink' to={`/details/${isChild}`}><img
                className="profile-logo"
                src={Profile}
                alt="profile-logo"/>
                <p className="hello-user">Profile</p></Link>
            </div>
            </div>  
            
        </div>
        <div className='phoneNavBar'>
      <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="#home"><img 
            className="main-logo"
            src={Logo}
            alt="logo"
            ></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className='navBtn'/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto phone-links">
              {(isChild) &&<div>
            <Link className="phone-link" to={`/restrictions/${isChild}/${auth.currentUser.email}`}>Shop</Link>
              </div>}
            <Link className="phone-link" to={`/transactions/${isChild}`}>Transactions</Link>
            <Link className="phone-link" to={`/details/${isChild}`}>Profile</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>    
    </div>
    </>
  )
}

export default NavBar