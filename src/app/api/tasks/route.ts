// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies, headers } from "next/headers";
import { logAction } from "@/app/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getUser(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;

  if (!user) {
    await logAction("Unauthorized access attempt", cookieStore, headerStore, { path: req.url });
    throw new Error("Unauthorized");
  }

  return { user, cookieStore, headerStore };
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await getUser(req);
    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const url = new URL(req.url);
    const filterUser = url.searchParams.get("user");
    const query = filterUser ? { username: { $regex: `^${filterUser}$`, $options: "i" } } : {};
    const tasks = await db.collection("tasks").find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, cookieStore, headerStore } = await getUser(req);
    const task = await req.json();

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const newTask = { ...task, createdAt: new Date().toISOString() };
    await db.collection("tasks").insertOne(newTask);

    await logAction("Created task", cookieStore, headerStore, { taskId: task.id });
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, cookieStore, headerStore } = await getUser(req);
    const { id, updates } = await req.json();

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const { _id, ...safeUpdates } = updates;
    const result = await db.collection("tasks").updateOne({ id }, { $set: safeUpdates });
    if (result.matchedCount === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    await logAction("Updated task", cookieStore, headerStore, { taskId: id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { user, cookieStore, headerStore } = await getUser(req);
    const { id } = await req.json();

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const result = await db.collection("tasks").deleteOne({ id });
    if (result.deletedCount === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    await logAction("Deleted task", cookieStore, headerStore, { taskId: id });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
