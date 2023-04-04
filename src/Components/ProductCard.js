import React, { useContext } from 'react';
import {Card,Form,Row,Col, Button} from 'react-bootstrap';
//using context api
import { CartContext } from '../CartContext.js';
//if default export is there u dont have to put curly braces
function ProductCard(props) {
    const product = props.prod;
    const cart = useContext(CartContext);
    const productQuantity = cart.getProductQuantity(product.id);
    
    //try doing cart.
  return (
    <Card>
        <Card.Body>
            <Card.Title>{product.title}</Card.Title>
            <Card.Text>${product.price}</Card.Text>
            { productQuantity> 0 
            ?
            <>
            <Form as={Row}>
              <Form.Label column="true" sm="6">In cart: {productQuantity}</Form.Label>
              <Col sm="6">
                <Button sm="6" className="mx-2 my-2" onClick={()=> {cart.addOneToCart(product.id); console.log(product.id) }}>+</Button>
                <Button sm="6" className="mx-2 my-2" onClick={()=> cart.removeOneFromCart(product.id)}>-</Button>
              </Col>
            </Form>
            <Button variant="danger" className="my-2" onClick={()=> cart.deleteFromCart(product.id)}>Remove From Cart</Button>
            </>
            :
            <Button variant="primary" onClick={()=> cart.addOneToCart(product.id)}>Add To Cart</Button>
            }
        </Card.Body>
    </Card>
  )
}

export default ProductCard