"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { register } from "@/app/actions/auth-actions"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setGeneralError("")
    setErrors({})

    // Basic client-side validation
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    // Create FormData object for server action
    const submitData = new FormData()
    submitData.append("firstName", formData.firstName)
    submitData.append("lastName", formData.lastName)
    submitData.append("email", formData.email)
    submitData.append("password", formData.password)

    try {
      const result = await register(submitData)

      if (result) {
        // Handle errors
        if (result.errors) {
          const fieldErrors: Record<string, string> = {}
          Object.entries(result.errors).forEach(([key, messages]) => {
            fieldErrors[key] = messages[0]
          })
          setErrors(fieldErrors)
        }

        if (result.message) {
          setGeneralError(result.message)
        }
      } else {
        // Success - redirect to onboarding
        router.push("/onboarding")
      }
    } catch (error) {
      setGeneralError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 text-center mb-6">
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        <p className="text-muted-foreground">Sign up for SariBooksPH</p>
      </div>

      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{generalError}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Juan"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Dela Cruz"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="juan.delacruz@example.com"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        By creating an account, you agree to our{" "}
        <a href="#" className="text-emerald-600 hover:text-emerald-800">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-emerald-600 hover:text-emerald-800">
          Privacy Policy
        </a>
      </p>
    </form>
  )
}
