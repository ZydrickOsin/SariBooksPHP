import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { compare, hash } from "bcryptjs"

// For password hashing
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Create a Supabase client for server components
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

// Middleware helper for route protection
export function updateSession(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Create a response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Get the cookies from the request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options })
        },
      },
    },
  )

  return { response, supabase }
}

// Get the current user from Supabase session
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return null
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, is_email_verified")
    .eq("id", session.user.id)
    .single()

  return user
}
