// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
import { logAction } from "@/app/lib/audit";

const PUBLIC_PATHS = ["/login", "/api/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 🔹 Allow Next.js internals
  if (path.startsWith("/_next")) return NextResponse.next();

  // 🔹 Allow public paths
  if (PUBLIC_PATHS.includes(path)) return NextResponse.next();

  // 🔹 Block known scanners/bots
  const ua = req.headers.get("user-agent") || "";
  if (
    ua.includes("Postman") ||
    ua.includes("curl") ||
    ua.includes("python") ||
    ua.includes("Go-http-client") ||
    ua.includes("Zap") ||
    ua.includes("Burp")
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // 🔹 Check auth cookie
  const cookieStore = await cookies();
  const headerStore = await headers();
  const auth = cookieStore.get("auth")?.value;

  if (!auth) {
    await logAction("Unauthorized access attempt to " + path, cookieStore, headerStore);
    // pretend app does not exist
    return new NextResponse(null, { status: 404 });
  }

  // 🔹 Passed all checks → allow access
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
