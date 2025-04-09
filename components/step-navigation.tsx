"use client"

import { Button } from "@/components/ui/button"

interface StepNavigationProps {
  currentStep: number
  goToNextStep: () => void
  goToPreviousStep: () => void
  isLastStep: boolean
}

export default function StepNavigation({
  currentStep,
  goToNextStep,
  goToPreviousStep,
  isLastStep,
}: StepNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 0}>
        Back
      </Button>

      <Button onClick={goToNextStep} className="bg-emerald-600 hover:bg-emerald-700">
        {isLastStep ? "Create Account" : "Continue"}
      </Button>
    </div>
  )
}
