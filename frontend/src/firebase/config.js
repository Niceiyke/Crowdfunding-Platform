// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuhS8bQabSsgd-LgGsw2r5l-TjxU8OmhQ",
  authDomain: "fundraising-d1601.firebaseapp.com",
  projectId: "fundraising-d1601",
  storageBucket: "fundraising-d1601.appspot.com",
  messagingSenderId: "248879848745",
  appId: "1:248879848745:web:e0938996f026cc8b0f2b38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
