// src/app/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { logAction } from "@/app/lib/audit";

export async function POST() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const user = cookieStore.get("auth")?.value || "Unknown";

  await logAction("Logout", cookieStore, headerStore, { username: user });

  const res = NextResponse.redirect("/login");
  res.cookies.set("auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return res;
}
