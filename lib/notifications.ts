import { prisma } from "./prisma";

interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  return prisma.notification.create({ data: params });
}

// Batch: notify all admins
export async function notifyAdmins(params: Omit<CreateNotificationParams, "userId">) {
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
  return Promise.all(admins.map((a) => createNotification({ ...params, userId: a.id })));
}
