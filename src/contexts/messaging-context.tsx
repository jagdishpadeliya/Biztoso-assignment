"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

export type ContactType = {
  id: string;
  name: string;
  avatar?: string;
  lastSeen: string;
  status: "online" | "offline" | "away";
};

export type MessageType = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
};

type ConversationType = {
  contact: ContactType;
  messages: MessageType[];
  unreadCount: number;
};

type MessagingContextType = {
  currentUser: ContactType | null;
  contacts: ContactType[];
  conversations: Record<string, ConversationType>;
  activeConversation: string | null;
  setActiveConversation: (contactId: string) => void;
  sendMessage: (contactId: string, content: string) => void;
  markAsRead: (contactId: string) => void;
  isConnected: boolean;
};

const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined
);

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<ContactType | null>(null);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [conversations, setConversations] = useState<
    Record<string, ConversationType>
  >({});
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
      // Attempt to reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error(
        "Connection Error, There was an error with the WebSocket connection. Trying to reconnect..."
      );
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleIncomingMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }, [toast]);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const handleIncomingMessage = useCallback(
    (data: any) => {
      if (data.type === "init") {
        setCurrentUser({
          id: data.user.id,
          name: data.user.name,
          lastSeen: new Date().toISOString(),
          status: "online",
        });
      } else if (data.type === "users") {
        const otherUsers = data.users.filter(
          (user) => user.id !== currentUser?.id
        );
        setContacts(
          otherUsers.map((user) => ({
            id: user.id,
            name: user.name,
            lastSeen: new Date().toISOString(),
            status: "online",
          }))
        );
      } else if (data.type === "chat") {
        const message: MessageType = {
          id: generateId(),
          senderId: data.senderId,
          senderName: data.senderName,
          content: data.content,
          timestamp: data.timestamp,
          status: "delivered",
        };

        setConversations((prev) => {
          const contactId = message.senderId;
          const conversation = prev[contactId] || {
            contact: contacts.find((c) => c.id === contactId) || {
              id: contactId,
              name: message.senderName,
              lastSeen: new Date().toISOString(),
              status: "online",
            },
            messages: [],
            unreadCount: 0,
          };

          return {
            ...prev,
            [contactId]: {
              ...conversation,
              messages: [...conversation.messages, message],
              unreadCount:
                contactId === activeConversation
                  ? 0
                  : conversation.unreadCount + 1,
            },
          };
        });
      }
    },
    [activeConversation, contacts, currentUser]
  );

  const sendMessage = useCallback(
    (contactId: string, content: string) => {
      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        toast.error(
          "Connection Error, Cannot send message: WebSocket not connected"
        );
        return;
      }

      const message = {
        type: "chat",
        content,
      };

      socketRef.current.send(JSON.stringify(message));

      // Optimistically update the UI
      const newMessage: MessageType = {
        id: generateId(),
        senderId: currentUser!.id,
        senderName: currentUser!.name,
        content,
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      setConversations((prev) => ({
        ...prev,
        [contactId]: {
          ...prev[contactId],
          messages: [...(prev[contactId]?.messages || []), newMessage],
        },
      }));
    },
    [currentUser, toast]
  );

  const markAsRead = useCallback((contactId: string) => {
    setConversations((prev) => ({
      ...prev,
      [contactId]: {
        ...prev[contactId],
        unreadCount: 0,
        messages: prev[contactId].messages.map((msg) =>
          msg.senderId === contactId && msg.status !== "read"
            ? { ...msg, status: "read" }
            : msg
        ),
      },
    }));
  }, []);

  return (
    <MessagingContext.Provider
      value={{
        currentUser,
        contacts,
        conversations,
        activeConversation,
        setActiveConversation,
        sendMessage,
        markAsRead,
        isConnected,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
}
