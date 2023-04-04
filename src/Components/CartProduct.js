import React, {useContext,useState,useEffect} from 'react';
import { Button } from 'react-bootstrap';
import { CartContext } from '../CartContext';
import { db } from "../firebase";
import { doc,where,getDocs,query,collection} from "firebase/firestore"; 

function CartProduct(props) {
  
  const cart=useContext(CartContext);
  const id=props.id;
  const quantity=props.quantity;
  const [productList, setProductList] = useState([]);
useEffect(() => {
  
  const viewProducts = async () => {
    const q = query(collection(db, "products"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const updatedData = querySnapshot.docs.map((doc) => doc.data());
    setProductList(updatedData);
  }
  
  viewProducts()
}, []);


  return (
    <div>
      {productList.map((product,idx) => (
        <>
        <h3>{product.title}</h3>
        <p>{quantity} total</p>
        <p>${ (quantity*product.price).toFixed(2) }</p>
        <Button size="sm" onClick={()=> cart.deleteFromCart(id)}>Remove</Button>
        <hr></hr>
        </>
      ))}
    </div>
  )
}

export default CartProduct