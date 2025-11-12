import React, { useEffect, useRef, useState } from "react";
import Card from "../components/Card";

import { initializeApp, getApps } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

export default function NotificationsDemo() {
  const [ready, setReady] = useState(false);
  const [lastMsg, setLastMsg] = useState(null);
  const msgRef = useRef(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    try {
      const firebaseConfig = {
        apiKey: "<YOUR_API_KEY>",
        authDomain: "<YOUR_AUTH_DOMAIN>",
        projectId: "<YOUR_PROJECT_ID>",
        storageBucket: "<YOUR_STORAGE_BUCKET>",
        messagingSenderId: "<YOUR_SENDER_ID>",
        appId: "<YOUR_APP_ID>",
      };

      const placeholders = Object.values(firebaseConfig).some((v) =>
        v?.includes?.("<YOUR_")
      );
      if (placeholders) {
        console.warn(
          "Firebase config contains placeholders — replace with real values."
        );
        setReady(false);
        return;
      }

      const app = getApps().length
        ? getApps()[0]
        : initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      const unsub = onMessage(messaging, (payload) => {
        const title =
          payload?.notification?.title || payload?.data?.title || "Message";
        const body =
          payload?.notification?.body ||
          payload?.data?.body ||
          JSON.stringify(payload);
        const msg = { title, body, raw: payload };
        setLastMsg(msg);
      });
      unsubscribeRef.current = unsub;

      msgRef.current = messaging;
      setReady(true);
    } catch (e) {
      console.warn("Firebase messaging init failed:", e?.message || e);
      setReady(false);
    }

    return () => {
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {}
      }
    };
  }, []);

  // request permission & show token
  const testNotification = async () => {
    if (!msgRef.current || !ready) {
      const demo = {
        title: "Test Notification",
        body: "Demo: FCM not configured",
      };
      setLastMsg(demo);
      return;
    }
    try {
      const perm = await window.Notification.requestPermission();
      if (perm !== "granted")
        return alert("Notification permission not granted");

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      const token = await getToken(msgRef.current, {
        vapidKey: "<YOUR_VAPID_KEY>",
        serviceWorkerRegistration: registration,
      });

      console.log("FCM token:", token);
      alert(
        "FCM token retrieved. See console. Send push from server to this token."
      );
    } catch (err) {
      console.error("Token error:", err);
      alert("Failed to retrieve token — see console.");
    }
  };

  // simulate crash
  const testCrash = async () => {
    const err = {
      message: "Demo crash triggered",
      time: new Date().toISOString(),
    };
    try {
      await fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(err),
      });
      alert("Error sent to /api/log-error (if endpoint exists).");
    } catch (e) {
      console.error("Crash simulated (no server):", err);
      alert("Crash simulated and logged to console.");
    }
  };

  return (
    <Card title="5. Firebase Notifications & Crashlytics Integration">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          This page demonstrates FCM (foreground) and a safe crash logging demo
          for web. Crashlytics is not supported on web.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-xs text-gray-500">
                  Foreground messages via FCM
                </div>
              </div>
              <button
                onClick={testNotification}
                className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
              >
                Test Notification
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Status:{" "}
              {ready ? (
                <span className="text-green-600">FCM ready</span>
              ) : (
                <span className="text-red-600">Not initialized</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Crash demo</div>
                <div className="text-xs text-gray-500">
                  Logs error to server or console
                </div>
              </div>
              <button
                onClick={testCrash}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Test Crash
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Server endpoint:{" "}
              <code className="bg-gray-100 px-1 rounded">
                POST /api/log-error
              </code>{" "}
              (optional)
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="font-medium mb-2">Last message</div>
          {lastMsg ? (
            <>
              <div className="font-semibold">{lastMsg.title}</div>
              <div className="text-sm text-gray-600">{lastMsg.body}</div>
            </>
          ) : (
            <div className="text-sm text-gray-400">
              No messages yet. Press Test Notification.
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Note: Crashlytics is for native apps. For web crash reporting consider
          Sentry or log to your server.
        </div>
      </div>
    </Card>
  );
}
