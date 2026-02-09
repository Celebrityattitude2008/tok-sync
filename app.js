// Shared app state and functions across all pages
let userPoints = 0;
let currentUser = null;
let userProfile = {
    name: '',
    tiktokHandle: '',
    email: '',
    tiktokUrl: '',
    points: 0,
    uid: ''
};

// Firebase Authentication imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

// Firebase Config
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
const messaging = getMessaging(app);

// Register Service Worker for push notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('✅ Service Worker registered:', registration);
    })
    .catch((error) => {
      console.warn('Service Worker registration failed:', error);
    });
}

// Request notification permission and get FCM token
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'BJ_QR_rHz9wSZub4wCy6ZDd3ZilckdoMypVHbDQbOpgBBrA5Mzd6ZPsIkFM8e2_mOKHWf5N-mfStd15iQ9LRwTk'
      });
      
      if (token) {
        console.log('🔔 FCM Token:', token);
        
        // Save token to user profile if logged in
        if (currentUser) {
          await saveNotificationToken(currentUser.uid, token);
        }
        
        return token;
      }
    } else if (permission === 'denied') {
      console.log('❌ Notification permission denied');
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
}

// Save notification token to database
async function saveNotificationToken(userId, token) {
  try {
    await setDoc(doc(db, 'notification_tokens', userId), {
      token: token,
      timestamp: new Date().toISOString(),
      userId: userId
    }, { merge: true });
    console.log('✅ Notification token saved');
  } catch (error) {
    console.error('Error saving notification token:', error);
  }
}

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log('📨 Message received in foreground:', payload);
  
  // Show in-app notification
  showInAppNotification(
    payload.notification.title || 'TokSync',
    payload.notification.body || 'You have a new notification'
  );
});

// Show in-app notification
function showInAppNotification(title, body) {
  // Create notification element if it doesn't exist
  let notificationContainer = document.getElementById('notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
    `;
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    background: linear-gradient(90deg, #ff0050 0%, #00f2ea 100%);
    color: white;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    font-family: Inter, sans-serif;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: 900; margin-bottom: 4px; font-size: 14px;">${title}</div>
    <div style="font-size: 12px; opacity: 0.9;">${body}</div>
  `;
  
  notificationContainer.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Monitor auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userProfile.uid = user.uid;
    userProfile.email = user.email;
    
    // Load user data from Firestore
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        userProfile = { ...userProfile, ...data };
        userPoints = data.points || 0;
        updateUIPoints();
      }
    } catch (error) {
      console.log('User data not found, creating new profile');
    }
  } else {
    currentUser = null;
    // Redirect to login if not authenticated on protected pages
    const protectedPages = ['dashboard.html', 'rank.html', 'f4f.html', 'me.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      window.location.href = 'login.html';
    }
  }
});

// Signup with Email/Password
async function signupWithEmail(email, password, fullname, tiktokLink) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: fullname,
      tiktokHandle: tiktokLink,
      tiktokUrl: tiktokLink,
      points: 0,
      createdAt: new Date().toISOString()
    });
    
    // Save to Realtime Database for handle tracking
    await set(ref(rtdb, 'users/' + user.uid), {
      handle: tiktokLink,
      name: fullname,
      email: email,
      points: 0,
      timestamp: new Date().toISOString()
    });
    
    userProfile = {
      uid: user.uid,
      email: email,
      name: fullname,
      tiktokHandle: tiktokLink,
      tiktokUrl: tiktokLink,
      points: 0
    };
    
    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Login with Email/Password
async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Load user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      userProfile = { ...userProfile, ...data };
      userPoints = data.points || 0;
    }
    
    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Logout
async function logoutUser() {
  try {
    await signOut(auth);
    currentUser = null;
    userProfile = {
      name: '',
      tiktokHandle: '',
      email: '',
      tiktokUrl: '',
      points: 0,
      uid: ''
    };
    userPoints = 0;
    localStorage.clear();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function updateUIPoints() {
    const pointsDisplay = document.getElementById('points-display');
    if (pointsDisplay) {
        pointsDisplay.innerText = `${userPoints} pts`;
    }
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const progressPercent = Math.min((userPoints / 5) * 100, 100);
        progressBar.style.width = `${progressPercent}%`;
    }
    
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.innerText = `${Math.min(userPoints, 5)}/5 Completed`;
    }
    
    const remainingText = document.getElementById('remaining-text');
    if (remainingText) {
        remainingText.innerText = `${Math.max(5 - userPoints, 0)} Remaining`;
    }

    const dropBtn = document.getElementById('drop-btn');
    if (dropBtn) {
        if (userPoints >= 5) {
            dropBtn.removeAttribute('disabled');
            dropBtn.classList.remove('bg-white/5', 'text-gray-600');
            dropBtn.classList.add('tok-gradient', 'text-black', 'shadow-lg');
            dropBtn.innerHTML = '🚀 Drop My TikTok Link';
        }
    }

    localStorage.setItem('userPoints', userPoints);
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

function loadUserPoints() {
    const saved = localStorage.getItem('userPoints');
    if (saved) {
        userPoints = parseInt(saved);
        updateUIPoints();
    }
    
    const profile = localStorage.getItem('userProfile');
    if (profile) {
        userProfile = JSON.parse(profile);
    }
}

// Add function to clear all data for fresh start
function clearAllData() {
    localStorage.removeItem('userPoints');
    localStorage.removeItem('userProfile');
    userPoints = 0;
    userProfile = {
        name: '',
        tiktokHandle: '',
        email: '',
        tiktokUrl: '',
        points: 0
    };
}

function startVerification(btn, url) {
    window.open(url, '_blank');
    btn.disabled = true;
    btn.classList.replace('bg-cyan-400', 'bg-zinc-800');
    btn.classList.add('text-gray-500');
    
    let countdown = 10;
    btn.innerText = `WAIT ${countdown}S`;

    const timer = setInterval(() => {
        countdown--;
        btn.innerText = `WAIT ${countdown}S`;
        if (countdown <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.innerText = "VERIFY";
            btn.classList.replace('bg-zinc-800', 'bg-green-500');
            btn.classList.remove('text-gray-500');
            btn.classList.add('text-white');
            btn.onclick = () => awardPoint(btn);
        }
    }, 1000);
}

function awardPoint(btn) {
    userPoints++;
    updateUIPoints();
    btn.innerText = "✅ DONE";
    btn.disabled = true;
    btn.classList.replace('bg-green-500', 'bg-zinc-900');
    btn.onclick = null;
}

function openDropModal() {
    const modal = document.getElementById('drop-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('drop-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Load points when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUserPoints);
} else {
    loadUserPoints();
}
