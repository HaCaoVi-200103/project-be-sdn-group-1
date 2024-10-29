// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "sweetbites-28804.firebaseapp.com",
  projectId: "sweetbites-28804",
  storageBucket: "sweetbites-28804.appspot.com",
  messagingSenderId: "1057690917505",
  appId: "1:1057690917505:web:d9648a0d8f8ce6b6a7cb80",
  measurementId: "G-CT1VHQ29PZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);