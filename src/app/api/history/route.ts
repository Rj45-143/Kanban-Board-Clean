import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET → load all history
export async function GET() {
  const client = await clientPromise;
  const db = client.db("kanban");

  const logs = await db
    .collection("history_logs")
    .find({})
    .sort({ timestamp: -1 })
    .limit(200)
    .toArray();

  return NextResponse.json(logs);
}

// POST → save new history
export async function POST(req: NextRequest) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("kanban");

  await db.collection("history_logs").insertOne({
    taskId: body.taskId,
    taskContent: body.taskContent,
    actionBy: body.actionBy,
    taskOwner: body.taskOwner,
    action: body.action,
    timestamp: new Date().toISOString()
  });

  return NextResponse.json({ success: true });
}
