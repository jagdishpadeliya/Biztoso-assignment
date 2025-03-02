"use client";

import { useState, useEffect } from "react";
import { useMessaging } from "@/contexts/messaging-context";

export function useOfflineMessages() {
  const { isConnected, sendMessage } = useMessaging();
  const [offlineMessages, setOfflineMessages] = useState<
    Array<{ contactId: string; content: string }>
  >([]);

  useEffect(() => {
    if (isConnected && offlineMessages.length > 0) {
      offlineMessages.forEach(({ contactId, content }) => {
        sendMessage(contactId, content);
      });
      setOfflineMessages([]);
    }
  }, [isConnected, offlineMessages, sendMessage]);

  const sendOfflineMessage = (contactId: string, content: string) => {
    if (isConnected) {
      sendMessage(contactId, content);
    } else {
      setOfflineMessages((prev) => [...prev, { contactId, content }]);
    }
  };

  return { sendOfflineMessage, offlineMessagesCount: offlineMessages.length };
}
