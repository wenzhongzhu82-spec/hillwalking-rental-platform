import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MessagesContent from "./MessagesContent";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const threads = await prisma.messageThread.findMany({
    where: {
      OR: [
        { borrowerId: session.id },
        { lenderId: session.id },
      ],
    },
    orderBy: { lastMessageAt: "desc" },
    include: {
      item: {
        select: { id: true, title: true, images: true },
      },
      borrower: {
        select: { id: true, name: true, avatar: true },
      },
      lender: {
        select: { id: true, name: true, avatar: true },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          content: true,
          senderId: true,
          createdAt: true,
          readAt: true,
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              senderId: { not: session.id },
              readAt: null,
            },
          },
        },
      },
    },
  });

  const serializedThreads = JSON.parse(JSON.stringify(threads));

  return <MessagesContent threads={serializedThreads} userId={session.id} />;
}
