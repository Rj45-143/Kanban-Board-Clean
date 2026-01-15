// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/login", "/favicon.ico"];

// Middleware function
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
  const auth = req.cookies.get("auth")?.value;

  // 🔹 No auth → redirect to login instead of 404
  if (!auth) {
    return NextResponse.redirect("/login");
  }

  // 🔹 Auth cookie exists → allow access
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: "/:path*",
};
