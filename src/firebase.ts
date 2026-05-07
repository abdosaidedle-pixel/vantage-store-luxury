import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ⚠️ IMPORTANT: To make your store work for ALL customers, you MUST set up a Firebase project:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project called "vantage-store"
// 3. Add a "Web App" and copy the "firebaseConfig" object here
// 4. Enable "Cloud Firestore" and "Storage" in the Firebase console
// 5. Set Firestore Rules to "allow read, write: if true;" (for testing) or set proper Auth rules

const firebaseConfig = {
  apiKey: "AIzaSyB-EXAMPLE-KEY", // REPLACE THIS WITH YOUR REAL KEY
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
