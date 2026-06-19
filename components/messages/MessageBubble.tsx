import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  isSystem?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
  showTime?: boolean;
}

export default function MessageBubble({
  message,
  currentUserId,
  showTime = true,
}: MessageBubbleProps) {
  const isMine = message.senderId === currentUserId;
  const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // System message
  if (message.isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="px-4 py-1.5 bg-surface rounded-full text-xs text-muted-dark text-center max-w-[80%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 mb-3 max-w-[80%]",
        isMine ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words",
          isMine
            ? "bg-primary text-white rounded-tr-md"
            : "bg-surface text-foreground rounded-tl-md"
        )}
      >
        <p>{message.content}</p>
        {showTime && (
          <p
            className={cn(
              "text-[10px] mt-1 text-right",
              isMine ? "text-white/60" : "text-muted-light"
            )}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  );
}
