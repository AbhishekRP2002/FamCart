// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDziwd-YI5dSDnrM3Y4n4XIzfxBmv0gIIM",
  authDomain: "gfg-hackathon-16154.firebaseapp.com",
  projectId: "gfg-hackathon-16154",
  storageBucket: "gfg-hackathon-16154.appspot.com",
  messagingSenderId: "296496096959",
  appId: "1:296496096959:web:a0f96b6a459265ad81c80a",
  measurementId: "G-P7DJW0K04S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//export const db = getFirestore(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);