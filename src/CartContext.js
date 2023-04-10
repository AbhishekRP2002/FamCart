import { createContext, useState } from "react";
import { doc, getDoc,getDocs,collection,where,query} from "firebase/firestore"; 
import { db,auth } from "./firebase";

export const CartContext =createContext({
    items: [],
    isChild: false,
    checkChild: () => {},
    getProductQuantity: () => {},
    addOneToCart: () => {},
    removeOneFromCart: () => {},
    deleteFromCart: () => {},
    getTotalCost: () => {},
});

export function CartProvider({children}) {

    const [productList, setProductList] = useState([]);

    const checkChild = async () => {
        console.log(auth.currentUser.uid);
        const docRef = doc(db, "children", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("isChild yayyy!")
            setIsChild(true);
        } else {
            console.log("parenttt")
            setIsChild(false);
        }
    }
    

    const getProductData = async (id) => {
        const q = query(collection(db, "products"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        const updatedData = querySnapshot.docs.map((doc) => doc.data());
        setProductList(updatedData);
    }

    const [cartProducts,setCartProducts] =useState([]);
     //in cart we will store id and quantity only

     const [isChild, setIsChild] = useState(false);
     
     function getProductQuantity(id) {
        const quantity = cartProducts.find(prod => prod.id === id)?.quantity; //if undefined it wont throw error cuz of '?'
        if(quantity===undefined)
        return 0; //if prod isnt in cart,it will be added for the addonetocart function

        return quantity;
     }

     function addOneToCart(id) {
        const quantity = getProductQuantity(id);

        if(quantity===0) //product isnt in cart yet
        {
            setCartProducts(
                [
                    ...cartProducts,
                    {
                        id:id,
                        quantity:1
                    }
                ]
            )
        }
        else {
            setCartProducts(
                cartProducts.map(product => product.id ===id 
                    ? {...product,quantity: product.quantity + 1 } 
                    : product //else adding our prod to array like normal
                )
            )
        }
     }

     function deleteFromCart(id) {
        //filter : fif condition true, item added to array
            setCartProducts(
                    cartProducts =>
                    cartProducts.filter(prod => {
                        return prod.id !== id;
                    })
            )
     }

     function removeOneFromCart(id) {
        const quantity = getProductQuantity(id);

        if(quantity===1) //product isnt in cart yet
        {
            deleteFromCart(id);
        }
        else {
            setCartProducts(
                cartProducts.map(product => product.id ===id 
                    ? {...product,quantity: product.quantity - 1 } 
                    : product //else adding our prod to array like normal
                )
            )
        }
     }

     function getTotalCost() {
        var total = 0.0;
        cartProducts.map((item) => {
            getProductData(item.id);
            productList?.map((product) => {
                total+=(product.price)*(item.quantity)
            })
            })
        return total;
    }

    const contextValue = {
        items: cartProducts,
        checkChild,
        isChild: checkChild,
        getProductQuantity,
        addOneToCart,
        removeOneFromCart,
        deleteFromCart,
        getTotalCost,
    }
    return (
    <CartContext.Provider value={contextValue}>
         {children}  {/*anything inside cart provider will be the children. NOT A BIG DEAL */}
    </CartContext.Provider>
    )
}
//context (cart,addtocart,removefromcart) just initializes variables and functions to be stored in data cloud
//provider -> gives ur react app access to all things in ur context


export default CartProvider;