"use client"

import type React from "react"
import type { FormData } from "../onboarding-wizard"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StepProps {
  formData: FormData
  updateFormData: (data: FormData) => void
  errors: Record<string, string>
}

export default function TaxInfoStep({ formData, updateFormData, errors }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ ...formData, [name]: value })
  }

  const handleSwitchChange = (checked: boolean) => {
    updateFormData({ ...formData, vatRegistered: checked })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ ...formData, [name]: value })
  }

  const formatTIN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format as XXX-XXX-XXX-XXX if we have enough digits
    if (digits.length > 9) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9, 12)}`
    } else if (digits.length > 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`
    } else if (digits.length > 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}`
    } else {
      return digits
    }
  }

  const handleTINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatTIN(e.target.value)
    updateFormData({ ...formData, tinNumber: formattedValue })
  }

  const fiscalYearOptions = [
    "December 31 (Calendar Year)",
    "January 31",
    "February 28/29",
    "March 31",
    "April 30",
    "May 31",
    "June 30",
    "July 31",
    "August 31",
    "September 30",
    "October 31",
    "November 30",
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Tax Information</h2>
        <p className="text-muted-foreground">Set up your tax details for BIR compliance</p>
      </div>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="tinNumber">TIN Number</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-sm">Your 12-digit Taxpayer Identification Number issued by BIR</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="tinNumber"
            name="tinNumber"
            value={formData.tinNumber}
            onChange={handleTINChange}
            placeholder="123-456-789-000"
            required
            className={errors.tinNumber ? "border-red-500" : ""}
          />
          {errors.tinNumber && <p className="text-red-500 text-sm">{errors.tinNumber}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="vatRegistered">VAT Registered</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">
                      Businesses with annual sales exceeding ₱3M are required to register for VAT
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch id="vatRegistered" checked={formData.vatRegistered} onCheckedChange={handleSwitchChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
          <Select value={formData.fiscalYearEnd} onValueChange={(value) => handleSelectChange("fiscalYearEnd", value)}>
            <SelectTrigger id="fiscalYearEnd" className={errors.fiscalYearEnd ? "border-red-500" : ""}>
              <SelectValue placeholder="Select fiscal year end" />
            </SelectTrigger>
            <SelectContent>
              {fiscalYearOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fiscalYearEnd && <p className="text-red-500 text-sm">{errors.fiscalYearEnd}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birRegistrationDate">BIR Registration Date</Label>
          <Input
            id="birRegistrationDate"
            name="birRegistrationDate"
            type="date"
            value={formData.birRegistrationDate}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}
