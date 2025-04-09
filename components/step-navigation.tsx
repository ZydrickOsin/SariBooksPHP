"use client"

import { Button } from "@/components/ui/button"

interface StepNavigationProps {
  currentStep: number
  goToNextStep: () => void
  goToPreviousStep: () => void
  isLastStep: boolean
  isLoading?: boolean
}

export default function StepNavigation({
  currentStep,
  goToNextStep,
  goToPreviousStep,
  isLastStep,
  isLoading = false,
}: StepNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 0 || isLoading}>
        Back
      </Button>

      <Button onClick={goToNextStep} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading ? "Saving..." : isLastStep ? "Complete Setup" : "Continue"}
      </Button>
    </div>
  )
}
