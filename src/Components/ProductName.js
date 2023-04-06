import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // replace with your own Firebase config file

function ProductName({ id }) {
  const [name, setName] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const productName = await getProductNames(id);
      setName(productName);
    }
    fetchData();
  }, [id]);

  return (
    <div>
      <h1>{name}</h1>
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

export default ProductName;



