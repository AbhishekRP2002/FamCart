import React, { useContext, useState } from 'react';
import {Button, Container, Navbar, Modal} from 'react-bootstrap';
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import { CartContext } from '../../CartContext.js';
import { db, auth } from "../../firebase";
import "../Css/ParentHome.css"

import Add from "../Css/Images/add.png"




function ParentHome() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [showChild,setShowChild]=useState(false);
  const [showResponse,setShowResponse]=useState(false);

  const createChild = () => setShowChild(true);
  const handleClose = () => {
    setShowChild(false);
    setShowResponse(false);
  }
  
  const addChildToDB = async () => {
    const id = auth.currentUser.uid;
    await setDoc(doc(db, "link", email), {
      parent_id: id,
      child_username: username,
      child_email: email,
    });
    setShowChild(false);
    setShowResponse(true);
  };

  return (
    <>
    <div class="ParentHome">
      
      <div className="content">
      <h1 className="good-morning">Good Morning User!</h1>
      <div className="no-child">No Child Added</div>
      <div className="add-child">Add Child</div>
      
        <img
        onClick={createChild}
        className="add-button"
        src={Add}
        alt="add button"></img>
      </div>

      

        
      
      {/* <Modal show={showChild} onHide={handleClose}>
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add new child
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
                <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
                <Button onClick={addChildToDB}>Add your child's details</Button>
                </>
            </Modal.Body>
            </>
        </Modal>
        <Modal show={showResponse} onHide={handleClose}>
            <>
            <Modal.Header closeButton>
                <Modal.Title>
                    Child successfully created
                </Modal.Title>
            </Modal.Header>
            </>
        </Modal> */}
    </div>
    
    </>
  )
}

export default ParentHome