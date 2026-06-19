"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MessageList from "@/components/messages/MessageList";

interface Thread {
  id: string;
  item: { id: string; title: string };
  borrower: { id: string; name: string; avatar: string | null };
  lender: { id: string; name: string; avatar: string | null };
  messages: { id: string; content: string; senderId: string; createdAt: string; readAt: string | null }[];
  _count: { messages: number };
}

interface MessagesContentProps {
  threads: Thread[];
  userId: string;
}

export default function MessagesContent({ threads, userId }: MessagesContentProps) {
  const formattedThreads = threads.map((t) => {
    const otherUser = t.borrower.id === userId ? t.lender : t.borrower;
    const lastMsg = t.messages[0];
    const unread = t._count.messages > 0;
    return {
      id: t.id,
      otherUser: { id: otherUser.id, name: otherUser.name, avatar: otherUser.avatar },
      item: { id: t.item.id, title: t.item.title },
      lastMessage: lastMsg?.content || "",
      lastMessageAt: lastMsg?.createdAt || "",
      unread,
    };
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-surface-dark">
        <Link href="/" className="p-1 rounded-lg text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Messages</h1>
      </div>
      <MessageList threads={formattedThreads} />
    </div>
  );
}
