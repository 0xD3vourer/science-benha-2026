"use client";

import { useEffect } from "react";
import { app } from "@/lib/firebase";
import toast from "react-hot-toast";

const VAPID_KEY = "YOUR_KEY";

export default function NotificationProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const init = async () => {
      try {
        if (!("Notification" in window)) return;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // ✅ Dynamic import (مهم جدًا)
        const { getMessaging, getToken, onMessage } = await import(
          "firebase/messaging"
        );

        const messaging = getMessaging(app);

        // استقبال الإشعارات
        onMessage(messaging, (payload) => {
          toast.custom(() => (
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl p-4">
              <p className="font-bold">
                {payload.notification?.title}
              </p>
              <p className="text-sm">
                {payload.notification?.body}
              </p>
            </div>
          ));
        });

        // الحصول على التوكن
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });

        if (token) {
          const { doc, setDoc } = await import("firebase/firestore");
          const { db } = await import("@/lib/firebase");

          await setDoc(
            doc(db, "admin_tokens", "current"),
            {
              token,
              updatedAt: new Date(),
            },
            { merge: true }
          );
        }
      } catch (error) {
        console.error("FCM Error:", error);
      }
    };

    init();
  }, []);

  return null;
}