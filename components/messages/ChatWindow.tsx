"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import MessageBubble from "@/components/messages/MessageBubble";

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  isSystem?: boolean;
}

interface ChatThreadInfo {
  id: string;
  otherUserName: string;
  itemTitle: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  currentUserId: string;
  thread: ChatThreadInfo;
  onSend: (content: string) => Promise<void>;
  className?: string;
}

export default function ChatWindow({
  messages,
  currentUserId,
  thread,
  onSend,
  className,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await onSend(trimmed);
      setNewMessage("");
    } catch {
      // Error handling is done by parent
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-white rounded-2xl border border-surface-dark overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-dark bg-surface/50">
        <h3 className="text-sm font-semibold text-foreground">
          {thread.otherUserName}
        </h3>
        <p className="text-xs text-muted truncate">{thread.itemTitle}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-sm text-muted">No messages yet</p>
            <p className="text-xs text-muted-light mt-1">
              Send a message to start the conversation
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="px-4 py-3 border-t border-surface-dark bg-surface/50 flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-10 px-4 bg-white border border-surface-dark rounded-xl text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-light disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
