// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
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
  measurementId: "G-CT1VHQ29PZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Hàm deleteFile dùng để xóa một file khỏi Firebase Storage
 * @param {string} fileURL - URL của file cần xóa
 * @returns {Promise<void>}
 */

export const deleteFile = async (fileURL: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileURL);

    await deleteObject(fileRef);

    console.log("File deleted successfully from Firebase Storage.");
  } catch (error) {
    console.error("Error deleting file from Firebase Storage:", error);
    throw error;
  }
};
