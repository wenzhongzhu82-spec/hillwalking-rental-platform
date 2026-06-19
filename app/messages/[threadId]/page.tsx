import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ChatPageClient } from "./ChatPageClient";

export const dynamic = "force-dynamic";

interface ChatPageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { threadId } = await params;

  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    include: {
      item: {
        select: { id: true, title: true, images: true, dailyPrice: true },
      },
      borrower: {
        select: { id: true, name: true, avatar: true },
      },
      lender: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  if (!thread) {
    notFound();
  }

  // Check permission
  if (
    thread.borrowerId !== session.id &&
    thread.lenderId !== session.id &&
    session.role !== "ADMIN"
  ) {
    notFound();
  }

  // Fetch messages
  const messages = await prisma.message.findMany({
    where: { threadId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      threadId,
      senderId: { not: session.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  // Determine the other party
  const otherParty =
    thread.borrowerId === session.id ? thread.lender : thread.borrower;

  // Serialize for client
  const serializedThread = JSON.parse(JSON.stringify(thread));
  const serializedMessages = JSON.parse(JSON.stringify(messages));

  return (
    <ChatPageClient
      threadId={threadId}
      thread={serializedThread}
      initialMessages={serializedMessages}
      currentUserId={session.id}
      otherParty={otherParty}
    />
  );
}
