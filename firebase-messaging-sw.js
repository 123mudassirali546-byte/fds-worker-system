importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBtew57g9vAQRhX8t091Cub08J8m52gkjo0',
  authDomain: 'nexa-ca2ab.firebaseapp.com',
  projectId: 'nexa-ca2ab',
  storageBucket: 'nexa-ca2ab.firebasestorage.app',
  messagingSenderId: '385340485838',
  appId: '1:385340485838:web:8807604afaf04d16bde09f'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || 'NEXA';
  const options = {
    body: payload.notification?.body || 'New message',
    icon: './icon.svg',
    badge: './icon.svg',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const target = './nexa-direct-login.html';
    for (const client of list) if ('focus' in client) return client.focus();
    if (clients.openWindow) return clients.openWindow(target);
  }));
});
