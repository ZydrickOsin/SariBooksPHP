"use server"

import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/auth"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

// Validation schemas
const businessInfoSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  businessSize: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  businessAddress: z.string().optional(),
})

const taxInfoSchema = z.object({
  tinNumber: z
    .string()
    .min(1, "TIN number is required")
    .refine((val) => /^\d{3}-\d{3}-\d{3}-\d{3}$/.test(val) || /^\d{9}$/.test(val), "TIN number format is invalid"),
  vatRegistered: z.boolean(),
  fiscalYearEnd: z.string().min(1, "Fiscal year end is required"),
  birRegistrationDate: z.string().optional(),
})

const preferencesSchema = z.object({
  accountingMethod: z.enum(["cash", "accrual"]),
  chartOfAccounts: z.string(),
  currencyPreference: z.string(),
  digitalReceipts: z.boolean(),
})

export type OnboardingError = {
  message: string
  errors?: Record<string, string[]>
}

export async function saveBusinessInfo(formData: FormData): Promise<OnboardingError | null> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { message: "You must be logged in" }
    }

    const data = {
      businessName: formData.get("businessName") as string,
      businessType: formData.get("businessType") as string,
      businessSize: formData.get("businessSize") as string,
      industry: formData.get("industry") as string,
      businessAddress: formData.get("businessAddress") as string,
    }

    // Validate form data
    const validationResult = businessInfoSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const supabase = createServerSupabaseClient()

    // Check if user already has a business
    const { data: existingBusiness } = await supabase.from("businesses").select("id").eq("owner_id", user.id).single()

    if (existingBusiness) {
      // Update existing business
      const { error } = await supabase
        .from("businesses")
        .update({
          name: data.businessName,
          business_type: data.businessType,
          business_size: data.businessSize,
          industry: data.industry,
          business_address: data.businessAddress,
        })
        .eq("id", existingBusiness.id)

      if (error) {
        return { message: error.message }
      }
    } else {
      // Create new business
      const { error } = await supabase.from("businesses").insert({
        name: data.businessName,
        business_type: data.businessType,
        business_size: data.businessSize,
        industry: data.industry,
        business_address: data.businessAddress,
        owner_id: user.id,
      })

      if (error) {
        return { message: error.message }
      }
    }

    return null
  } catch (error) {
    console.error("Save business info error:", error)
    return {
      message: "An error occurred while saving business information",
    }
  }
}

export async function saveTaxInfo(formData: FormData): Promise<OnboardingError | null> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { message: "You must be logged in" }
    }

    const data = {
      tinNumber: formData.get("tinNumber") as string,
      vatRegistered: formData.get("vatRegistered") === "true",
      fiscalYearEnd: formData.get("fiscalYearEnd") as string,
      birRegistrationDate: formData.get("birRegistrationDate") as string,
    }

    // Validate form data
    const validationResult = taxInfoSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const supabase = createServerSupabaseClient()

    // Get user's business
    const { data: business } = await supabase.from("businesses").select("id").eq("owner_id", user.id).single()

    if (!business) {
      return { message: "Business profile not found" }
    }

    // Check if tax profile exists
    const { data: existingTaxProfile } = await supabase
      .from("tax_profiles")
      .select("id")
      .eq("business_id", business.id)
      .single()

    if (existingTaxProfile) {
      // Update existing tax profile
      const { error } = await supabase
        .from("tax_profiles")
        .update({
          tin_number: data.tinNumber,
          vat_registered: data.vatRegistered,
          fiscal_year_end: data.fiscalYearEnd,
          bir_registration_date: data.birRegistrationDate,
        })
        .eq("id", existingTaxProfile.id)

      if (error) {
        return { message: error.message }
      }
    } else {
      // Create new tax profile
      const { error } = await supabase.from("tax_profiles").insert({
        tin_number: data.tinNumber,
        vat_registered: data.vatRegistered,
        fiscal_year_end: data.fiscalYearEnd,
        bir_registration_date: data.birRegistrationDate,
        business_id: business.id,
      })

      if (error) {
        return { message: error.message }
      }
    }

    return null
  } catch (error) {
    console.error("Save tax info error:", error)
    return {
      message: "An error occurred while saving tax information",
    }
  }
}

export async function savePreferences(formData: FormData): Promise<OnboardingError | null> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { message: "You must be logged in" }
    }

    const data = {
      accountingMethod: formData.get("accountingMethod") as "cash" | "accrual",
      chartOfAccounts: formData.get("chartOfAccounts") as string,
      currencyPreference: formData.get("currencyPreference") as string,
      digitalReceipts: formData.get("digitalReceipts") === "true",
    }

    // Validate form data
    const validationResult = preferencesSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const supabase = createServerSupabaseClient()

    // Get user's business
    const { data: business } = await supabase.from("businesses").select("id").eq("owner_id", user.id).single()

    if (!business) {
      return { message: "Business profile not found" }
    }

    // Check if preferences exist
    const { data: existingPreferences } = await supabase
      .from("bookkeeping_preferences")
      .select("id")
      .eq("business_id", business.id)
      .single()

    if (existingPreferences) {
      // Update existing preferences
      const { error } = await supabase
        .from("bookkeeping_preferences")
        .update({
          accounting_method: data.accountingMethod,
          chart_of_accounts: data.chartOfAccounts,
          currency_preference: data.currencyPreference,
          digital_receipts: data.digitalReceipts,
        })
        .eq("id", existingPreferences.id)

      if (error) {
        return { message: error.message }
      }
    } else {
      // Create new preferences
      const { error } = await supabase.from("bookkeeping_preferences").insert({
        accounting_method: data.accountingMethod,
        chart_of_accounts: data.chartOfAccounts,
        currency_preference: data.currencyPreference,
        digital_receipts: data.digitalReceipts,
        business_id: business.id,
      })

      if (error) {
        return { message: error.message }
      }
    }

    return null
  } catch (error) {
    console.error("Save preferences error:", error)
    return {
      message: "An error occurred while saving preferences",
    }
  }
}

export async function completeOnboarding() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect("/")
    }

    const supabase = createServerSupabaseClient()

    // Get user's business with related data
    const { data: business } = await supabase
      .from("businesses")
      .select(`
        id, 
        tax_profiles (id),
        bookkeeping_preferences (id)
      `)
      .eq("owner_id", user.id)
      .single()

    if (
      !business ||
      !business.tax_profiles ||
      !business.tax_profiles.length ||
      !business.bookkeeping_preferences ||
      !business.bookkeeping_preferences.length
    ) {
      return { message: "Onboarding not complete" }
    }

    // In a real app, you might update a user's onboarding status here
    // For now, we'll just redirect to the dashboard
    redirect("/dashboard")
  } catch (error) {
    console.error("Complete onboarding error:", error)
    return {
      message: "An error occurred while completing onboarding",
    }
  }
}
