import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Replace with your Firebase config if you have one
const firebaseConfig = {
  apiKey: "AIzaSyB-EXAMPLE-KEY",
  authDomain: "vantage-store-luxury.firebaseapp.com",
  projectId: "vantage-store-luxury",
  storageBucket: "vantage-store-luxury.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
