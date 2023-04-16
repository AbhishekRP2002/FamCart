import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import "./Css/Expenditure.css";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useParams } from "react-router-dom";

function Expenditure() {
  const [info, setInfo] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { childEmail } = useParams();

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

  useEffect(() => {
    const viewGraph = async () => {
      const docu = doc(db, 'restrictions', childEmail);
      const docuSnap = await getDoc(docu);
      const data = docuSnap.data();
      let arr = data.bought;
      console.log(arr);
      for (let i = 0; i < arr.length; i++) {
        const productName = await getProductNames(data.product_id[i]);
        setInfo(prevState => ({ ...prevState, [productName]: arr[i] }));
      }
      setIsLoaded(true);
    };

    viewGraph().catch(err => {
      console.error('error occured: ', err.message);
    });
  }, []);

  if (!isLoaded) {
    return null;
  }

  const data = Object.entries(info).map(([name, quantity]) => ({ name, quantity }));

  return (
    <div className='graph'>
      <h1>Expenditure Analysis</h1>
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="name" stroke="#144273" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="quantity" fill="#15477b" barSize={30} />
      </BarChart>
    </div>
  );
}

export default Expenditure;
