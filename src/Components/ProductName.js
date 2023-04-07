import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // replace with your own Firebase config file

function ProductName({ id,nameIsOne,quantity }) {
  const [name, setName] = useState([]);
  const [price, setPrice] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const productName = await getProductNames(id);
      setName(productName);
      const productPrice = await getProductPrice(id);
      setPrice(productPrice)
    }


    fetchData();
  }, [id]);

  return (
    <div>
      {nameIsOne==="1"
      ?<h1 className='trans_info'>{name}</h1>
      :<h1 className='trans_info'>{price*quantity}</h1>
      }
    </div>
  );
}

const getProductNames = async (id) => {
  const docu = doc(db, 'products', id.toString());
  const docuSnap = await getDoc(docu);

  if (docuSnap.exists()) {
    const dataR = docuSnap.data();
    return dataR.title;
  } else {
    console.log('No matching documents.');
    return null;
  }
};

const getProductPrice = async (id) => {
  const docu = doc(db, 'products', id.toString());
  const docuSnap = await getDoc(docu);

  if (docuSnap.exists()) {
    const dataR = docuSnap.data();
    return dataR.price;
  } else {
    console.log('No matching documents.');
    return null;
  }
};

export default ProductName;



