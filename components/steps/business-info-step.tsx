"use client"

import type React from "react"
import type { FormData } from "../onboarding-wizard"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface StepProps {
  formData: FormData
  updateFormData: (data: FormData) => void
  errors: Record<string, string>
}

export default function BusinessInfoStep({ formData, updateFormData, errors }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ ...formData, [name]: value })
  }

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Corporation",
    "One Person Corporation",
    "Cooperative",
    "Branch Office",
    "Representative Office",
    "Regional HQ",
  ]

  const businessSizes = [
    "Micro (1-9 employees)",
    "Small (10-99 employees)",
    "Medium (100-199 employees)",
    "Large (200+ employees)",
  ]

  const industries = [
    "Retail",
    "Food & Beverage",
    "Manufacturing",
    "Services",
    "Construction",
    "Agriculture",
    "Information Technology",
    "Healthcare",
    "Education",
    "Finance & Banking",
    "Real Estate",
    "Transportation",
    "Other",
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Business Information</h2>
        <p className="text-muted-foreground">Tell us about your business in the Philippines</p>
      </div>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Sari-Sari Store"
            required
            className={errors.businessName ? "border-red-500" : ""}
          />
          {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business type</Label>
          <Select value={formData.businessType} onValueChange={(value) => handleSelectChange("businessType", value)}>
            <SelectTrigger id="businessType" className={errors.businessType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessType && <p className="text-red-500 text-sm">{errors.businessType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessSize">Business size</Label>
          <Select value={formData.businessSize} onValueChange={(value) => handleSelectChange("businessSize", value)}>
            <SelectTrigger id="businessSize">
              <SelectValue placeholder="Select business size" />
            </SelectTrigger>
            <SelectContent>
              {businessSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
            <SelectTrigger id="industry" className={errors.industry ? "border-red-500" : ""}>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress">Business address</Label>
          <Textarea
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            placeholder="123 Rizal Street, Barangay San Antonio, Manila"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
