import React, {useState} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {Row, Col} from 'react-bootstrap';
import { db, auth } from "../firebase";
import { doc, setDoc, collection } from "firebase/firestore"; 
import "./Css/Login.css"
import Parent from "./Css/Images/parent.png";
import Kid from "./Css/Images/kid.png";
import Check from "./Css/Images/check.png";

function Login() {
    const [parent,setParent]=useState(false);
    const [child,setChild]=useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");//add
    const [username, setUsername] = useState("");

    const [isSignup, setIsSignup] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);


    const handleParent = () => {
        setParent(true);
        setChild(false);
    }
    const handleChild = () => {
        setChild(true);
        setParent(false);
    }

  let navigate = useNavigate();

  const saveParentData = async (id) => {
      await setDoc(doc(db, "parents", id), {
        id: id,
        username: username,
        email: email,
        password:password
      });
  }

  const saveChildData = async (id) => {
    await setDoc(doc(db, "children", id), {
      id: id,
      username: username,
      email: email,
      password:password
    });
}

  const signIn = () => {
    setIsSigningIn(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        if(child===true)
        navigate("/")
        else if(parent===true)
        navigate("/parent")
      })
      .catch((error) => {
        alert(error.message);
        setIsSigningIn(false)
      });
  };

  const register = () => {
    if(1) //ValidateEmail(email)
    {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        if(child===true)
        {
          saveChildData(uid);
          navigate("/");
        }
        else if(parent===true)
        {
          saveParentData(uid);
          navigate("/parent")
        }
        })
      .catch((error) => {
        alert(error.message);
      });
    }
  };

  const toggleAuth = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setIsSignup((prev) => !prev);
  };

  function ValidateEmail(inputText)
{
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
if(inputText.match(mailformat))
{
  if((inputText.endsWith("gmail.com"))||(inputText.endsWith("nitrkl.ac.in"))||(inputText.endsWith("hotmail.com"))||(inputText.endsWith("outlook.com"))||(inputText.endsWith("yahoo.com")))
  {
    return true;
  }
  else
  {
    console.log("check")
      alert("Please check your Email ID.");
      return false;
    }
  }
else
{
alert("You have entered an invalid email address");
return false;
}
}


  return (
    <>
    <meta name="viewport" content="width=device-width, initial-scale=1" ></meta>
      <div className="loginPage">
      <Row>
          <Col align="center">
          
       <div className="left">
          <h1 className="chooseAcc">Choose Your Account Type</h1>
          <br />
          {parent
          ?<button className="chooseBtn chooseBtnShow" onClick={handleParent}><img className= 'choose-img' src={Parent} /><img className= 'check' src={Check} /><hr /><h6>Parent</h6></button>
          :<button className="chooseBtn" onClick={handleParent}><img className= 'choose-img' src={Parent} /><hr /><h6 className='select'>Parent</h6></button>
          }
          {child
          ?<button className="chooseBtn  chooseBtnShow" onClick={handleChild}><img className= 'choose-img' src={Kid} /><img className= 'check' src={Check} /><hr /><h6>Child</h6></button>
          :<button className="chooseBtn" onClick={handleChild}><img className= 'choose-img' src={Kid} /><hr /><h6 className='select'>Child</h6></button>
          }
       </div>
       </Col>
       <Col className="right">
      { (parent===true && child===false) || (child===true && parent===false)
      ?
      <>
      <div>
        <div>
          {isSignup 
          ?<>
          <h1 className="createHeader">Create Your Account</h1>
          <div className="inputBox">
            <label className="label">USERNAME</label>
            <input className="input" onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" autocomplete="off"/>
            <label className="label">EMAIL</label>
            <input className="input" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" autocomplete="off" />
            <label className="label">PASSWORD</label>
            <input className="input" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" autocomplete="off" />
            <label className="label">CONFIRM PASSWORD</label>
            <input className="input" onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" autocomplete="off" />
            <br />
            <button  onClick={register} className="signInBtn">SIGN UP</button>
          </div>
          <div className="toggle">
                Already have an account? 
                <button onClick={toggleAuth} className="toggleBtn">Login</button>
          </div>
          </>
          :
          <>
          
          <h1  className="createHeader">Login To Your Account</h1>
          <div className="inputBox">
            <label className="label">EMAIL</label>
            <input className="input" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" autocomplete="off" />
            <label className="label">PASSWORD</label>
            <input className="input" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" autocomplete="off" />
            <br />
            {isSigningIn
              ?<button onClick={signIn} className="signInBtn">SIGNING IN</button>
              :<button onClick={signIn} className="signInBtn">SIGN IN</button>
            }
            
          </div>
           <div className="toggle">
                <h6 className='noAccount'></h6>Don't have an account?
                <button onClick={toggleAuth} className="toggleBtn">Sign up</button>
           </div>
          </>
          }
        </div>
      </div>
      </>
      :
      <div>  </div> }
      </Col>
       </Row>
    </div>
    </>
  );
}

export default Login;