"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { baseURL } from "@/utils/BaseURL";
import { getToken } from "@/utils/storage";
import { useDispatch } from "react-redux";
import { baseApi } from "@/utils/apiBaseQuery";
import toast from "react-hot-toast";

interface NotificationSocketData {
  title?: string;
  body?: string;
  message?: string;
  data?: {
    title?: string;
    body?: string;
    message?: string;
  };
}

export default function SocketListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    // Establish Socket.IO Connection
    const socket: Socket = io(baseURL, {
      extraHeaders: {
        authorization: formattedToken,
        Authorization: formattedToken,
      },
      auth: {
        authorization: formattedToken,
        Authorization: formattedToken,
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected successfully:", socket.id);
    });

    // Listen to "notification:new" event
    socket.on("notification:new", (data: NotificationSocketData) => {
      console.log("Notification Socket Event Received (notification:new):", data);

      // Invalidate RTK Query "notification" tag to refresh data everywhere
      dispatch(baseApi.util.invalidateTags(["notification"]));

      // Extract title and body
      const notifTitle = data?.title || data?.data?.title || "New Notification";
      const notifBody = data?.body || data?.message || data?.data?.body || data?.data?.message || "You have a new alert.";

      // Display live notification toast
      toast(
        (t) => (
          <div
            onClick={() => toast.dismiss(t.id)}
            className="flex flex-col gap-1 cursor-pointer"
          >
            <p className="font-bold text-sm text-gray-900">{notifTitle}</p>
            <p className="text-xs text-gray-600 leading-normal">{notifBody}</p>
          </div>
        ),
        {
          icon: "🔔",
          duration: 5000,
          style: {
            borderRadius: "14px",
            background: "#ffffff",
            color: "#1A1D2E",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            border: "1px solid #EBF2FA",
            padding: "12px 16px",
          },
        }
      );
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
    });

    return () => {
      socket.off("notification:new");
      socket.disconnect();
    };
  }, [dispatch]);

  return null;
}
