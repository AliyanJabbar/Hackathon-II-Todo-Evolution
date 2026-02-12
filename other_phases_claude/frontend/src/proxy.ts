// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("proxy running...")

  // Run this only for /todo routes
  if (pathname.startsWith("/todo")) {
    // Check for NextAuth session token
    const sessionToken = request.cookies.get("next-auth.session-token")?.value ||
                         request.cookies.get("__Secure-next-auth.session-token")?.value; // for HTTPS

    // If not authenticated, redirect to signin
    if (!sessionToken) {
      const loginUrl = new URL("/register", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Let all other routes through
  return NextResponse.next();
}

export const config = {
  matcher: "/todo", // apply to /todo and subpaths
};
