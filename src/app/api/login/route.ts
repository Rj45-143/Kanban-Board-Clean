import { NextResponse } from "next/server";
import { validateLogin } from "@/app/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: "Missing credentials" },
      { status: 400 }
    );
  }

  const isValid = validateLogin(username, password);

  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Invalid username or password" },
      { status: 401 }
    );
  }

  // create session cookie
  const response = NextResponse.json({ success: true });

  response.cookies.set("auth", username, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
