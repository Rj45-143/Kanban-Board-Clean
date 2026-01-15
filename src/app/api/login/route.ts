import { NextResponse } from "next/server";
import { validateLogin } from "@/app/lib/auth";
import { logAction } from "@/app/lib/audit";
import { cookies, headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Missing credentials" }, { status: 400 });
    }

    const isValid = validateLogin(username, password);

    const cookieStore = await cookies();
    const headerStore = await headers();
    await logAction("Login attempt", cookieStore, headerStore, { username, success: isValid });

    if (!isValid) {
      return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
