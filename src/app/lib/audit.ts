import clientPromise from "./mongodb";
import { cookies, headers } from "next/headers";

export async function logAction(
  action: string,
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  headerStore: any, // ❌ Huwag mag-type annotate, TS will infer correctly
  extraData?: Record<string, any>
) {
  const user = cookieStore.get("auth")?.value || "Unknown";
  const ip = headerStore.get("x-forwarded-for") || "Unknown";

  const client = await clientPromise;
  const db = client.db("kanban");

  await db.collection("audit_logs").insertOne({
    username: user,
    action,
    ip,
    timestamp: new Date().toISOString(),
    ...extraData,
  });
}
