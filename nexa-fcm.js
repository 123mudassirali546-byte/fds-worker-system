/* NEXA Firebase Cloud Messaging client setup. Public Firebase config only. */
const NEXA_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBtew57g9vAQRhX8t091Cub08J8m52gkjo0',
  authDomain: 'nexa-ca2ab.firebaseapp.com',
  projectId: 'nexa-ca2ab',
  storageBucket: 'nexa-ca2ab.firebasestorage.app',
  messagingSenderId: '385340485838',
  appId: '1:385340485838:web:8807604afaf04d16bde09f'
};
const NEXA_FCM_VAPID_KEY = 'BKvVf4CfyezstbgmDDxq7FkKolaL761vd29wObhrsFPLK_u57GqE9petLbZVQmnNm1Pzqy9D8K0226IeH9SkQKc';

async function registerNexaPush(db, userId) {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return {ok:false, reason:'unsupported'};
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return {ok:false, reason:'permission-denied'};
  const appMod = await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');
  const msgMod = await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging.js');
  const app = appMod.getApps().length ? appMod.getApps()[0] : appMod.initializeApp(NEXA_FIREBASE_CONFIG);
  const sw = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
  const messaging = msgMod.getMessaging(app);
  const token = await msgMod.getToken(messaging, {vapidKey:NEXA_FCM_VAPID_KEY, serviceWorkerRegistration:sw});
  if (!token) return {ok:false, reason:'no-token'};
  const r = await db.from('fcm_devices').upsert({user_id:userId,fcm_token:token,updated_at:new Date().toISOString()},{onConflict:'user_id,fcm_token'});
  if (r.error) return {ok:false, reason:r.error.message};
  return {ok:true, token};
}
window.registerNexaPush = registerNexaPush;
