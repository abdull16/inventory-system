import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4JZ-jATwYsCD4OeaKF8dsTudFtFwYsBE",
  authDomain: "inventory-management-9e35c.firebaseapp.com",
  projectId: "inventory-management-9e35c",
  storageBucket: "inventory-management-9e35c.appspot.com",
  messagingSenderId: "19397585936",
  appId: "1:19397585936:web:a57aae484a80a6f4a8ee95",
  measurementId: "G-G2GRZKTS4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};