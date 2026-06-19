import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ user: null });
    }

    return Response.json({ user: session });
  } catch (error) {
    console.error("Get me error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
