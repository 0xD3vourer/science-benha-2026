"use client";

import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '@/lib/firebase'; // ✅ المهم
import toast from 'react-hot-toast';

const VAPID_KEY = 'YOUR_KEY';

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
        toast.custom(() => (
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl p-4">
            <p className="font-bold">{payload.notification?.title}</p>
            <p className="text-sm">{payload.notification?.body}</p>
          </div>
        ));
      });

      const token = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (token) {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');

        await setDoc(doc(db, 'admin_tokens', 'current'), {
          token,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('FCM Error:', error);
    }
  };

  return null;
}