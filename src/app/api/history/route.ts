import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies, headers } from "next/headers";
import { logAction } from "@/app/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;
  if (!user) return NextResponse.json([], { status: 401 });

  const client = await clientPromise;
  const db = client.db("kanbanDB");

  const logs = await db.collection("history_logs").find({}).sort({ timestamp: -1 }).limit(200).toArray();
  await logAction("Fetched history logs", cookieStore, headerStore);
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("kanbanDB");

  await db.collection("history_logs").insertOne({
    taskId: body.taskId,
    taskContent: body.taskContent,
    actionBy: body.actionBy,
    taskOwner: body.taskOwner,
    action: body.action,
    timestamp: new Date().toISOString(),
  });

  await logAction("Created history log", cookieStore, headerStore, { taskId: body.taskId });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.passcode !== process.env.HISTORY_PASSCODE) {
    await logAction("Failed delete history attempt", cookieStore, headerStore);
    return NextResponse.json({ success: false, message: "Incorrect passcode" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("kanbanDB");
  await db.collection("history_logs").deleteMany({});
  await logAction("Cleared all history logs", cookieStore, headerStore);
  return NextResponse.json({ success: true, message: "History logs cleared!" });
}
