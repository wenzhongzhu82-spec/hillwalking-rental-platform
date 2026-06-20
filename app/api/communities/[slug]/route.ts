import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { members: true, items: true },
        },
      },
    });

    if (!community) {
      return Response.json({ error: "Community not found" }, { status: 404 });
    }

    return Response.json({ community });
  } catch (error) {
    console.error("Get community by slug error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
