"use client"

import type React from "react"

import type { FormData } from "../onboarding-wizard"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface StepProps {
  formData: FormData
  updateFormData: (data: FormData) => void
}

export default function RoleAndGoalsStep({ formData, updateFormData }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (goal: string) => {
    const updatedGoals = formData.secondaryGoals.includes(goal)
      ? formData.secondaryGoals.filter((g) => g !== goal)
      : [...formData.secondaryGoals, goal]

    updateFormData({ ...formData, secondaryGoals: updatedGoals })
  }

  const primaryGoals = [
    "Increase productivity",
    "Improve collaboration",
    "Automate workflows",
    "Enhance customer experience",
    "Reduce costs",
    "Other",
  ]

  const secondaryGoals = [
    "Team management",
    "Project tracking",
    "Document sharing",
    "Client communication",
    "Data analysis",
    "Reporting",
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Your Role & Goals</h2>
        <p className="text-muted-foreground">Help us understand how we can best serve your needs</p>
      </div>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job title</Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Product Manager"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryGoal">Primary goal</Label>
          <Select value={formData.primaryGoal} onValueChange={(value) => handleSelectChange("primaryGoal", value)}>
            <SelectTrigger id="primaryGoal">
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent>
              {primaryGoals.map((goal) => (
                <SelectItem key={goal} value={goal}>
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Secondary goals (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {secondaryGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={formData.secondaryGoals.includes(goal)}
                  onCheckedChange={() => handleCheckboxChange(goal)}
                />
                <Label htmlFor={goal} className="cursor-pointer">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
