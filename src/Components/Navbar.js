import React,{ useState, useEffect, useContext} from 'react';
import {Button, Container, Navbar, Modal} from 'react-bootstrap';
//you need to also add bootstrap link in the ap.js page or here
//modal sis the cart popup
import { useNavigate } from "react-router-dom";
import { CartContext } from '../CartContext.js';
import CartProduct from './CartProduct.js';
import { auth } from '../firebase.js';
import { doc, getDoc,getDocs,collection,where,query} from "firebase/firestore"; 
import { db } from '../firebase.js';

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
        <Navbar expand="sm">
            <Navbar.Brand href="/">FamCard</Navbar.Brand>
            <Navbar.Toggle/> {/* for collapsing in mobile */}
            <Navbar.Collapse className="justify-content-end">
                <Button onClick={handleShow}>Cart ({cartCount} Items)</Button>
                <Button onClick={handleLogOut}>LogOut</Button>
            </Navbar.Collapse>
        </Navbar>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Your Shopping Cart
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {cartCount > 0
                ?
                <>
                    <p>Items in your cart:</p>
                    { cart.items?.map((product)=> (
                        <>
                        <CartProduct id={product.id} quantity={product.quantity}></CartProduct>
                        </>
                    ))}
                    <h1>Total: {getTotalCost?.toFixed(2)}</h1>

                    <Button variant="success">
                        Proceed to check out
                    </Button>
                </>
                :
                <h1>There are no items in your cart</h1>
                }
            </Modal.Body>
        </Modal>
    </>
  )
}

export default NavBar
