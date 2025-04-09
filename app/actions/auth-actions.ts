"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/auth"
import { hashPassword } from "@/lib/auth"

// Validation schemas
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type AuthError = {
  message: string
  errors?: Record<string, string[]>
}

export async function register(formData: FormData): Promise<AuthError | null> {
  try {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    // Validate form data
    const validationResult = registerSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const supabase = createServerSupabaseClient()

    // Check if user exists first
    const { data: existingUser } = await supabase.from("users").select("email").eq("email", data.email).single()

    if (existingUser) {
      return {
        message: "User with this email already exists",
      }
    }

    // First, create the auth user
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      return {
        message: authError.message,
      }
    }

    if (!authUser.user) {
      return {
        message: "Failed to create user",
      }
    }

    // Hash password for our custom users table
    const hashedPassword = await hashPassword(data.password)

    // Create user in our custom table
    const { error: dbError } = await supabase.from("users").insert({
      id: authUser.user.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password_hash: hashedPassword,
      verification_token: Math.random().toString(36).substring(2, 15),
    })

    if (dbError) {
      return {
        message: dbError.message,
      }
    }

    // In a real app, you would send a verification email here
    return null
  } catch (error) {
    console.error("Registration error:", error)
    return {
      message: "An error occurred during registration",
    }
  }
}

export async function login(formData: FormData): Promise<AuthError | null> {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    // Validate form data
    const validationResult = loginSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const supabase = createServerSupabaseClient()

    // Sign in with Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        message: "Invalid email or password",
      }
    }

    return null
  } catch (error) {
    console.error("Login error:", error)
    return {
      message: "An error occurred during login",
    }
  }
}

export async function logout() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect("/")
}
