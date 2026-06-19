"use client";

import Link from "next/link";
import { cn, timeAgo } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";

interface ThreadUser {
  id: string;
  name: string;
  avatar: string | null;
}

interface ThreadItem {
  id: string;
  title: string;
}

interface Thread {
  id: string;
  otherUser: ThreadUser;
  item: ThreadItem;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
}

interface MessageListProps {
  threads: Thread[];
  currentThreadId?: string;
  className?: string;
}

export default function MessageList({
  threads,
  currentThreadId,
  className,
}: MessageListProps) {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted">No messages yet</p>
        <p className="text-xs text-muted-light mt-1">
          Start a rental request to begin chatting
        </p>
      </div>
    );
  }

  return (
    <div className={cn("divide-y divide-surface-dark", className)}>
      {threads.map((thread) => (
        <Link
          key={thread.id}
          href={`/messages/${thread.id}`}
          className={cn(
            "flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors",
            currentThreadId === thread.id && "bg-primary-50"
          )}
        >
          <div className="relative flex-shrink-0">
            <Avatar
              src={thread.otherUser.avatar}
              name={thread.otherUser.name}
              size="md"
            />
            {thread.unread && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent border-2 border-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h4
                className={cn(
                  "text-sm truncate",
                  thread.unread
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted-dark"
                )}
              >
                {thread.otherUser.name}
              </h4>
              <span className="text-[10px] text-muted-light flex-shrink-0 ml-2">
                {timeAgo(thread.lastMessageAt)}
              </span>
            </div>
            <p className="text-xs text-muted truncate">
              {thread.item.title}
            </p>
            <p
              className={cn(
                "text-xs truncate mt-0.5",
                thread.unread ? "text-muted-dark font-medium" : "text-muted-light"
              )}
            >
              {thread.lastMessage}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
