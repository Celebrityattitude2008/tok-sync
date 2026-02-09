// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, query, orderBy, limit, getDocs, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, set, update, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5w4KexHboBWX0c9a-2_6x0h_LMtjZHSI",
  authDomain: "toksync-6be5b.firebaseapp.com",
  projectId: "toksync-6be5b",
  storageBucket: "toksync-6be5b.firebasestorage.app",
  messagingSenderId: "868358025613",
  appId: "1:868358025613:web:4a0d760617210e9284cdc4",
  measurementId: "G-TM6FB9KBCK",
  databaseURL: "https://toksync-6be5b.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Database functions for user handles and data
export async function saveUserHandle(userId, handleData) {
  try {
    const userRef = ref(rtdb, 'users/' + userId);
    await set(userRef, {
      handle: handleData.tiktokHandle,
      name: handleData.name,
      email: handleData.email,
      tiktokUrl: handleData.tiktokUrl,
      points: handleData.points || 0,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving user handle:', error);
    return false;
  }
}

export async function getUserHandle(userId) {
  try {
    const userRef = ref(rtdb, 'users/' + userId);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error('Error getting user handle:', error);
    return null;
  }
}

export async function updateUserPoints(userId, points) {
  try {
    const userRef = ref(rtdb, 'users/' + userId);
    await update(userRef, { points: points });
    return true;
  } catch (error) {
    console.error('Error updating points:', error);
    return false;
  }
}

export async function getAllHandles() {
  try {
    const usersRef = ref(rtdb, 'users');
    const snapshot = await get(usersRef);
    return snapshot.exists() ? snapshot.val() : {};
  } catch (error) {
    console.error('Error getting all handles:', error);
    return {};
  }
}

export { auth, db, rtdb, collection, addDoc, doc, getDoc, setDoc, updateDoc, query, orderBy, limit, getDocs, where };