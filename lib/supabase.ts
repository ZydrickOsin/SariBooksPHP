import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

// Create a Supabase client for anonymous users (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a Supabase client with service role for admin operations (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Helper function to get client depending on admin access needs
export function getSupabase(admin = false) {
  return admin ? supabaseAdmin : supabase
}
