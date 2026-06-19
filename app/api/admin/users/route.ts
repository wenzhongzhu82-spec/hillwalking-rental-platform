import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");
    const verified = searchParams.get("verified");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (verified === "true") {
      where.verified = true;
    } else if (verified === "false") {
      where.verified = false;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          grade: true,
          house: true,
          role: true,
          verified: true,
          rating: true,
          creditScore: true,
          completedOrders: true,
          createdAt: true,
          _count: {
            select: {
              items: true,
              rentalRequestsAsBorrower: true,
              sentMessages: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return Response.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action, adminNote } = body;

    if (!userId || !action) {
      return Response.json(
        { error: "userId and action are required" },
        { status: 400 }
      );
    }

    const validActions = ["VERIFY", "SUSPEND", "UNSUSPEND", "PROMOTE_ADMIN", "DEMOTE_USER"];
    if (!validActions.includes(action)) {
      return Response.json(
        { error: `Invalid action. Must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, verified: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    switch (action) {
      case "VERIFY":
        if (user.verified) {
          return Response.json(
            { error: "User is already verified" },
            { status: 400 }
          );
        }
        updateData.verified = true;
        break;
      case "SUSPEND":
        // Suspend is implemented by un-verifying the user
        updateData.verified = false;
        break;
      case "UNSUSPEND":
        if (user.verified) {
          return Response.json(
            { error: "User is not suspended" },
            { status: 400 }
          );
        }
        updateData.verified = true;
        break;
      case "PROMOTE_ADMIN":
        if (user.role === "ADMIN") {
          return Response.json(
            { error: "User is already an admin" },
            { status: 400 }
          );
        }
        updateData.role = "ADMIN";
        break;
      case "DEMOTE_USER":
        if (user.role !== "ADMIN") {
          return Response.json(
            { error: "User is not an admin" },
            { status: 400 }
          );
        }
        updateData.role = "USER";
        break;
    }

    // Create an admin note record
    if (adminNote) {
      await prisma.adminNote.create({
        data: {
          userId,
          content: `[${action}] ${adminNote}`,
          createdById: session.id,
        },
      });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        grade: true,
        house: true,
        role: true,
        verified: true,
        rating: true,
        creditScore: true,
        createdAt: true,
      },
    });

    return Response.json({ user: updated });
  } catch (error) {
    console.error("Admin update user error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
