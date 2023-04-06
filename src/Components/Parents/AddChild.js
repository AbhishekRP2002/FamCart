import React, { useState } from 'react'

import { db, auth } from "../../firebase";
import { doc, setDoc, collection } from "firebase/firestore"; 
import { Button } from 'react-bootstrap';

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
    <div>
        <h1>Let's begin with a simple journey of managing your child's pocket money!</h1>
        <h4>Enter Details</h4>
        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
        <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
        <Button onClick={addChildToDB}>
            Submit
        </Button>
    </div>
  )
}

export default AddChild