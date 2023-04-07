import React,{ useState, useEffect, useContext} from 'react';
import {Button, Container, Navbar, Modal} from 'react-bootstrap';
//you need to also add bootstrap link in the ap.js page or here
//modal sis the cart popup
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from '../CartContext.js';
import CartProduct from './CartProduct.js';
import { auth } from '../firebase.js';
import { doc, getDoc,getDocs,collection,where,query} from "firebase/firestore"; 
import { db } from '../firebase.js';
import "./Css/Navbar.css"
import Profile from "./Css/Images/profile.png"
import Logo from "./Css/Images/logo.png"

function NavBar() {

    const [show,setShow]=useState(false);
    let navigate = useNavigate();
    const user =  auth.currentUser;

    const handleClose = () => setShow(false);
    const handleLogOut = () => 
    {   
        auth.signOut()
        navigate("/login")
    }
    const handleShow = () => {
        setShow(true);
    }

    const [productList, setProductList] = useState([]);

    // const getProductData = async (id) => {
    //     const q = query(collection(db, "products"), where("id", "==", id));
    //     const querySnapshot = await getDocs(q);
    //     const updatedData = querySnapshot.docs.map((doc) => doc.data());
    //     setProductList(updatedData);
    // }

    const getTotalCost = async() => 
        {   
            var total = 0.0;
            await Promise.all(cart.items.map(async (item) => {
                const docRef = collection(db, "products",item.id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                  } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                  }
                total+=docSnap.price*item.quantity
            }))
            return total;
            
        }


    useEffect(() => {
        getTotalCost()
    }, []) 

    const cart = useContext(CartContext);

    const cartCount = cart.items.reduce((sum,itemamt) => sum + itemamt.quantity, 0);

  return (
    <>

    <div className="nav-bar">
           
            <img 
            className="main-logo"
            src={Logo}
            alt="logo"
            ></img>
            
            <div className='nav-right'>
            <div className='link'>
            <Link className="links" to="/transactions">Transactions</Link>
            </div>
            <div className='link'>
            <Link className="links" to="/restrictions">Restrictions</Link>
            </div>
            <div className="profile">
                <img
                className="profile-logo"
                src={Profile}
                alt="profile-logo"/>
                <p className="hello-user">Hello, User</p>
            </div>
            </div>  
            
        </div>
        
        
    </>
  )
}

export default NavBar