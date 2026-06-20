import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.status !== "PENDING") {
      return Response.json(
        { error: "Report has already been resolved" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, adminNote } = body;

    if (!status || !["RESOLVED", "DISMISSED"].includes(status)) {
      return Response.json(
        { error: 'Status must be "RESOLVED" or "DISMISSED"' },
        { status: 400 }
      );
    }

    const updated = await prisma.report.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote || null,
      },
      include: {
        reporter: {
          select: { id: true, name: true, avatar: true },
        },
        item: {
          select: { id: true, title: true, status: true },
        },
        targetUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create notification for the reporter
    try {
      const resolutionText = status === "RESOLVED" ? "resolved" : "dismissed";
      await createNotification({
        userId: updated.reporterId,
        type: "REPORT_RESOLVED",
        title: `Report ${resolutionText}`,
        message: `Your report has been ${resolutionText} by an admin.`,
        actionUrl: `/dashboard`,
      });
    } catch (notifErr) {
      console.error("Failed to create notification:", notifErr);
    }

    return Response.json({ report: updated });
  } catch (error) {
    console.error("Update report error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
