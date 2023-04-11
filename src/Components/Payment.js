import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { doc, setDoc, collection, query, where, getDocs,getDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { db } from "./../firebase";

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

const Payment = ({amt,id}) => {

  const [success,setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [prevBalance,setPrevBalance] = useState("");

  const handleSubmit = async (event) => {

    const updateBalance = async () => {
      const docRef = doc(db, "children", id);
      const docSnap = await getDoc(docRef);
      let updatedData=0;
      if (docSnap.exists()) {
        updatedData = docSnap.data().balance;
        console.log("prev is " +updatedData)
      } else {
        console.log('No matching documents.');
      }
      const newBalance = parseInt(updatedData,10) + parseInt(amt,10); //problem
      console.log(updatedData+" amt (to pay) = "+parseInt(amt,10)+" new = "+newBalance)
      setDoc(docRef, { balance: newBalance }, { merge: true });
      setSuccess(true)
    }
    updateBalance().catch(err => {
      console.error('error occured: ',err.message)
    });

    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const {id} = paymentMethod
        const response = await axios.post("http://localhost:4000/payment", {
        amount: amt*100,
        id
      })
      if(response.data.success)
      {
        console.log("success")
        setSuccess(true)
      }
    }
    catch(error) {
      console.log("Error", error)
    }
  } else {
    console.log("Error", error.message)
  }
}

  return (
    <div className="payment">
    {!success
      ?<form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS}/>
            </div>
          </fieldset>
          <button>
            Pay
          </button>
      </form>
      :
      <div>
        <h2>Payment is complete. Thank you!</h2>
      </div>
    }
    </div>
  );
};

export default Payment;
