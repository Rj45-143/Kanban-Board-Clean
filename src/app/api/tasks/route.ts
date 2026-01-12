export const dynamic = "force-dynamic"; // important for dynamic routes

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

// GET all tasks
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kanbanDB");
    const tasks = await db.collection("tasks").find({}).toArray();
    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST new task
export async function POST(req: NextRequest) {
  try {
    const task = await req.json();
    if (!task || !task.id) {
      return NextResponse.json({ message: "Invalid task data" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    await db.collection("tasks").insertOne(task);
    return NextResponse.json({ message: "Task added!" });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT (update) task
export async function PUT(req: NextRequest) {
  try {
    const { id, updates } = await req.json();
    if (!id || !updates) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    // Remove _id if it exists in updates
    const { _id, ...safeUpdates } = updates;

    const result = await db.collection("tasks").updateOne(
      { id },          // filter by custom task id
      { $set: safeUpdates } // only safe fields
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated!" });
  } catch (err) {
    console.error("PUT /api/tasks error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("kanbanDB");

    const result = await db.collection("tasks").deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted!" });
  } catch (err) {
    console.error("DELETE /api/tasks error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
