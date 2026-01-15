import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { logAction } from "@/app/lib/audit";

export async function GET() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const user = cookieStore.get("auth")?.value;

  if (!user) {
    await logAction("Unauthorized /me access attempt", cookieStore, headerStore);
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await logAction("Viewed own user info", cookieStore, headerStore);

  return NextResponse.json({ user });
}
