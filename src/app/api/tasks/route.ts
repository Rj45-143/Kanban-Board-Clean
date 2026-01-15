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
  if (!user) {
    await logAction("Unauthorized GET /tasks attempt", cookieStore, headerStore);
    return NextResponse.json([], { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const url = new URL(req.url);
    const filterUser = url.searchParams.get("user");

    const query = filterUser ? { username: { $regex: `^${filterUser}$`, $options: "i" } } : {};
    const tasks = await db.collection("tasks").find(query).sort({ createdAt: -1 }).toArray();

    await logAction("Fetched tasks", cookieStore, headerStore);
    return NextResponse.json(tasks);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const task = await req.json();
    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const newTask = { ...task, createdAt: new Date().toISOString() };
    await db.collection("tasks").insertOne(newTask);

    await logAction("Created task", cookieStore, headerStore, { taskId: task.id });
    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, updates } = await req.json();
    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const { _id, ...safeUpdates } = updates;
    const result = await db.collection("tasks").updateOne({ id }, { $set: safeUpdates });
    if (result.matchedCount === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    await logAction("Updated task", cookieStore, headerStore, { taskId: id });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const result = await db.collection("tasks").deleteOne({ id });
    if (result.deletedCount === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    await logAction("Deleted task", cookieStore, headerStore, { taskId: id });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
