"use client";

import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getApp, getApps, initializeApp } from 'firebase/app';
import toast from 'react-hot-toast';

const firebaseConfig = {
  apiKey: "AIzaSyC5G6u78lBt_sRT268kCznIWipCW0q-oio",
  authDomain: "science-benha-2026.firebaseapp.com",
  projectId: "science-benha-2026",
  storageBucket: "science-benha-2026.firebasestorage.app",
  messagingSenderId: "725961025715",
  appId: "1:725961025715:web:bb725210a31406cc8a68c6"
};

// الحصول على app (تجنب initializing مرتين)
const getFirebaseApp = () => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

const app = getFirebaseApp();

// 👇 ضع الـ VAPID Key اللي جبته هنا
const VAPID_KEY = 'BCUj3rnqw_EEYRvXN91PJBVGg5xrsdygP1SHfR2KrmKDajP0VbrJ2n6ySQLmDIbBTYAQX2o8SCf5_v0mtmifrxg';

export default function NotificationProvider() {
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    const requestPermission = async () => {
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
          setPermission(true);
          await getFCMToken();
        }
      }
    };
    requestPermission();
  }, []);

  const getFCMToken = async () => {
    try {
      const messaging = getMessaging(app);
      
      onMessage(messaging, (payload) => {
        console.log('Message received: ', payload);
        toast.custom((t) => (
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl p-4 shadow-xl max-w-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <p className="font-bold">{payload.notification?.title}</p>
                <p className="text-sm opacity-90">{payload.notification?.body}</p>
              </div>
            </div>
          </div>
        ), { duration: 8000 });
      });

      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (token) {
        console.log('✅ FCM Token:', token);
        localStorage.setItem('fcm_token', token);
        
        // حفظ الـ token في Firebase
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        await setDoc(doc(db, 'admin_tokens', 'current'), {
          token: token,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('❌ FCM Error:', error);
    }
  };

  return null;
}