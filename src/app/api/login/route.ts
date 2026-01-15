import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { validateLogin } from "@/app/lib/auth";
import { logAction } from "@/app/lib/audit";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const body = await req.json();
  const { username, password } = body;

  if (!validateLogin(username, password)) {
    await logAction("Failed login attempt", cookieStore, headerStore, { attemptedUser: username });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("auth", username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  await logAction("Successful login", cookieStore, headerStore, { username });
  return res;
}
