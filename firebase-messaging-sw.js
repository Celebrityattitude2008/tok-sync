// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

// Firebase configuration
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

// Initialize Firebase in the service worker
const app = firebase.initializeApp(firebaseConfig);

// Initialize Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 Background Message received:', payload);
  
  const notificationTitle = payload.notification.title || 'TokSync';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'toksync-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open TokSync'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ],
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('📲 Notification clicked:', event.notification.tag);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notification dismissed');
});
