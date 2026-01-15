import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies, headers } from "next/headers";
import { logAction } from "@/app/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;
  if (!user) return NextResponse.json([], { status: 401 });

  const client = await clientPromise;
  const db = client.db("kanbanDB");

  const url = new URL(req.url);
  const filterUser = url.searchParams.get("user");
  const query = filterUser ? { username: { $regex: `^${filterUser}$`, $options: "i" } } : {};

  const tasks = await db.collection("tasks").find(query).sort({ createdAt: -1 }).toArray();
  await logAction("Fetched tasks", cookieStore, headerStore);
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const task = await req.json();
  const client = await clientPromise;
  const db = client.db("kanbanDB");

  const newTask = { ...task, createdAt: new Date().toISOString() };
  await db.collection("tasks").insertOne(newTask);

  await logAction("Created task", cookieStore, headerStore, { taskId: task.id });
  return NextResponse.json(newTask, { status: 201 });
}

// PUT and DELETE follow same pattern: auth + logAction
