"use client"

import type { FormData } from "../onboarding-wizard"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Sun, Moon } from "lucide-react"

interface StepProps {
  formData: FormData
  updateFormData: (data: FormData) => void
}

export default function PreferencesStep({ formData, updateFormData }: StepProps) {
  const handleRadioChange = (value: string) => {
    updateFormData({ ...formData, notificationPreference: value })
  }

  const handleThemeChange = (value: string) => {
    updateFormData({ ...formData, theme: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Your Preferences</h2>
        <p className="text-muted-foreground">Customize your experience with our platform</p>
      </div>

      <div className="grid gap-6 py-4">
        <div className="space-y-3">
          <Label>Notification preferences</Label>
          <RadioGroup
            value={formData.notificationPreference}
            onValueChange={handleRadioChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Email notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="push" id="push" />
              <Label htmlFor="push">Push notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Both email and push</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">No notifications</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Theme preference</Label>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                {formData.theme === "light" ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div>
                <p className="font-medium">{formData.theme === "light" ? "Light" : "Dark"} mode</p>
                <p className="text-sm text-muted-foreground">
                  {formData.theme === "light"
                    ? "Use light theme for the interface"
                    : "Use dark theme for the interface"}
                </p>
              </div>
            </div>
            <Switch
              checked={formData.theme === "dark"}
              onCheckedChange={(checked) => handleThemeChange(checked ? "dark" : "light")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
