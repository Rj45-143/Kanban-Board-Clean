export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

// GET all tasks
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const tasks = await db
      .collection("tasks")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST new task
export async function POST(req: NextRequest) {
  try {
    const task = await req.json();

    if (!task || !task.id || !task.title) {
      return NextResponse.json(
        { error: "Invalid task data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const newTask = {
      ...task,
      createdAt: new Date(),
    };

    await db.collection("tasks").insertOne(newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json(
      { error: "Failed to add task" },
      { status: 500 }
    );
  }
}

// PUT update task
export async function PUT(req: NextRequest) {
  try {
    const { id, updates } = await req.json();

    if (!id || !updates) {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const { _id, ...safeUpdates } = updates;

    const result = await db.collection("tasks").updateOne(
      { id },
      { $set: safeUpdates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/tasks error:", err);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE task
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid delete request" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const result = await db.collection("tasks").deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/tasks error:", err);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
