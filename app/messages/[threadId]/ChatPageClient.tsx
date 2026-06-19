"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ChatWindow from "@/components/messages/ChatWindow";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender?: { id: string; name: string; avatar: string | null };
}

interface ChatPageClientProps {
  threadId: string;
  thread: {
    id: string;
    item: { id: string; title: string };
  };
  initialMessages: Message[];
  currentUserId: string;
  otherParty: { id: string; name: string; avatar: string | null };
}

export function ChatPageClient({
  threadId,
  thread,
  initialMessages,
  currentUserId,
  otherParty,
}: ChatPageClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSend = async (content: string) => {
    const res = await fetch(`/api/messages/threads/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to send");
    const data = await res.json();
    setMessages((prev) => [...prev, data.message]);
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-dark">
        <Link href="/messages" className="p-1 rounded-lg text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
      <ChatWindow
        messages={messages}
        currentUserId={currentUserId}
        thread={{
          id: threadId,
          otherUserName: otherParty.name,
          itemTitle: thread.item.title,
        }}
        onSend={handleSend}
        className="flex-1 rounded-none border-0"
      />
    </div>
  );
}
