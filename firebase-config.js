// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5w4KexHboBWX0c9a-2_6x0h_LMtjZHSI",
  authDomain: "toksync-6be5b.firebaseapp.com",
  projectId: "toksync-6be5b",
  storageBucket: "toksync-6be5b.firebasestorage.app",
  messagingSenderId: "868358025613",
  appId: "1:868358025613:web:4a0d760617210e9284cdc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // THIS IS THE LINE THAT MAKES DB GREE

export { auth, db, collection, addDoc, doc, getDoc, query, orderBy, limit, getDocs };