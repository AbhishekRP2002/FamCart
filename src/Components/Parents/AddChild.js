import React, { useState } from 'react'

import { db, auth } from "../../firebase";
import { doc, setDoc, collection } from "firebase/firestore"; 
import { Button } from 'react-bootstrap';

import "../Css/AddChild.css"


function AddChild() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    const addChildToDB = async () => {
        const id = auth.currentUser.uid;
        await setDoc(doc(db, "link", email), {
          parent_id: id,
          child_username: username,
          child_email: email,
          balance: 0
        });
      };
  return (
    <div className="add-kid">
        <h1 className="headline">Let's begin with a simple journey of managing your child's pocket money!</h1>
        <h4 className="enter-details">Enter Details</h4>
        <div className='inputBox'>
        <h6 className="label">NAME</h6>
        <input className="input-field" onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Full Name" />
        <h6 className="label">EMAIL</h6>
        <input className="input-field" onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
        <Button 
        className="submit-btn"
        onClick={addChildToDB}>
            Submit
        </Button>
        </div>
    </div>
  )
}

export default AddChild

        
      
   