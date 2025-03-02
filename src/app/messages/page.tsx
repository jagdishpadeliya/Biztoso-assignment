"use client";

import type React from "react";

import { useMessaging } from "@/contexts/messaging-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate, formatTime } from "@/lib/utils";
import { Send, Wifi, WifiOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useOfflineMessages } from "@/hooks/use-offline-messages";

export default function MessagesPage() {
  const {
    contacts,
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    markAsRead,
    isConnected,
  } = useMessaging();

  const { offlineMessagesCount } = useOfflineMessages();

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (activeConversation) {
      markAsRead(activeConversation);
    }
  }, [activeConversation, markAsRead]);

  const handleSendMessage = useCallback(() => {
    if (!activeConversation || !messageInput.trim()) return;

    sendMessage(activeConversation, messageInput.trim());
    setMessageInput("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeConversation, messageInput, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const totalUnreadCount = Object.values(conversations).reduce(
    (sum, conversation) => sum + conversation.unreadCount,
    0
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span>Disconnected - Trying to reconnect...</span>
              </>
            )}
          </p>
        </div>

        {totalUnreadCount > 0 && (
          <Badge variant="secondary" className="text-sm">
            {totalUnreadCount} unread{" "}
            {totalUnreadCount === 1 ? "message" : "messages"}
          </Badge>
        )}
        {offlineMessagesCount > 0 && (
          <Badge variant="destructive" className="text-sm ml-2">
            {offlineMessagesCount} offline{" "}
            {offlineMessagesCount === 1 ? "message" : "messages"}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Contacts List */}
        <Card className="md:col-span-1 overflow-hidden">
          <div className="p-4 border-b font-medium">Contacts</div>
          <ScrollArea className="h-[calc(100%-57px)]">
            <div className="p-2">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <button
                    key={contact.id}
                    className={cn(
                      "w-full text-left p-3 rounded-md mb-2 flex items-center gap-3 hover:bg-muted transition-colors",
                      activeConversation === contact.id && "bg-muted"
                    )}
                    onClick={() => setActiveConversation(contact.id)}
                  >
                    <div className="relative">
                      {/* <Image
                        src={
                          contact.avatar ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={contact.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      /> */}
                      <div>
                        <MessageSquareIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div
                        className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                          contact.status === "online"
                            ? "bg-green-500"
                            : contact.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        )}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate">
                          {contact.name}
                        </span>
                        {conversations[contact.id]?.unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {conversations[contact.id].unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.status === "online"
                          ? "Online"
                          : contact.status === "away"
                          ? "Away"
                          : `Last seen ${formatDate(contact.lastSeen)}`}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No contacts found
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Window */}
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col overflow-hidden">
          {activeConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                {/* <Image
                  src={
                    conversations[activeConversation]?.contact.avatar ||
                    "/placeholder.svg?height=40&width=40"
                  }
                  alt={conversations[activeConversation]?.contact.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                /> */}
                <div>
                  <MessageSquareIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">
                    {conversations[activeConversation]?.contact.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {conversations[activeConversation]?.contact.status ===
                    "online"
                      ? "Online"
                      : conversations[activeConversation]?.contact.status ===
                        "away"
                      ? "Away"
                      : `Last seen ${formatDate(
                          conversations[activeConversation]?.contact.lastSeen
                        )}`}
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {conversations[activeConversation]?.messages.map(
                    (message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.senderId === "current-user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted"
                        )}
                      >
                        <div className="break-words">{message.content}</div>
                        <div
                          className={cn(
                            "text-xs mt-1 text-right",
                            message.senderId === "current-user"
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatTime(message.timestamp)}
                          {message.senderId === "current-user" && (
                            <span className="ml-1">
                              {message.status === "sent"
                                ? "✓"
                                : message.status === "delivered"
                                ? "✓✓"
                                : "✓✓✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || !isConnected}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!isConnected && (
                  <p className="text-xs text-destructive mt-2">
                    You are currently offline. Messages will be sent when you
                    reconnect.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-4 p-4 rounded-full bg-muted">
                <MessageSquareIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">Your Messages</h3>
              <p className="text-muted-foreground max-w-md">
                Select a contact to start messaging. Your conversations will
                appear here.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Message Square Icon component
function MessageSquareIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
