import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const { response, supabase } = updateSession(request)

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register"]

  // If the user is not authenticated and trying to access a protected route
  if (!session && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If the user is authenticated and trying to access auth pages
  if (session && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
