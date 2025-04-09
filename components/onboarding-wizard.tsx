"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import BusinessInfoStep from "./steps/business-info-step"
import TaxInfoStep from "./steps/tax-info-step"
import BookkeepingPreferencesStep from "./steps/bookkeeping-preferences-step"
import CompletionStep from "./steps/completion-step"
import StepIndicator from "./step-indicator"
import StepNavigation from "./step-navigation"
import SariBooksLogo from "./saribooks-logo"

export type FormData = {
  // Business info
  businessName: string
  businessType: string
  businessSize: string
  industry: string
  businessAddress: string

  // Tax info
  tinNumber: string
  vatRegistered: boolean
  fiscalYearEnd: string
  birRegistrationDate: string

  // Bookkeeping preferences
  accountingMethod: string
  chartOfAccounts: string
  currencyPreference: string
  digitalReceipts: boolean

  // User info (passed from authentication)
  firstName?: string
  lastName?: string
  email?: string
}

const initialFormData: FormData = {
  businessName: "",
  businessType: "",
  businessSize: "",
  industry: "",
  businessAddress: "",
  tinNumber: "",
  vatRegistered: false,
  fiscalYearEnd: "",
  birRegistrationDate: "",
  accountingMethod: "accrual",
  chartOfAccounts: "standard",
  currencyPreference: "PHP",
  digitalReceipts: true,
  // In a real app, you would get these from the authentication context
  firstName: "Juan",
  lastName: "Dela Cruz",
  email: "juan@example.com",
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    {
      title: "Business",
      component: <BusinessInfoStep formData={formData} updateFormData={setFormData} errors={errors} />,
      validate: () => {
        const newErrors: Record<string, string> = {}

        if (!formData.businessName) newErrors.businessName = "Business name is required"
        if (!formData.businessType) newErrors.businessType = "Business type is required"
        if (!formData.industry) newErrors.industry = "Industry is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      },
    },
    {
      title: "Tax Info",
      component: <TaxInfoStep formData={formData} updateFormData={setFormData} errors={errors} />,
      validate: () => {
        const newErrors: Record<string, string> = {}

        if (!formData.tinNumber) newErrors.tinNumber = "TIN number is required"
        else if (!/^\d{3}-\d{3}-\d{3}-\d{3}$/.test(formData.tinNumber) && !/^\d{9}$/.test(formData.tinNumber)) {
          newErrors.tinNumber = "TIN number format is invalid"
        }

        if (!formData.fiscalYearEnd) newErrors.fiscalYearEnd = "Fiscal year end is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      },
    },
    {
      title: "Preferences",
      component: <BookkeepingPreferencesStep formData={formData} updateFormData={setFormData} errors={errors} />,
      validate: () => true,
    },
    {
      title: "Complete",
      component: <CompletionStep formData={formData} />,
      validate: () => true,
    },
  ]

  const goToNextStep = () => {
    const isValid = steps[currentStep].validate()

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = () => {
    const isValid = steps[currentStep].validate()

    if (isValid) {
      // Here you would typically send the data to your backend
      console.log("Form submitted with data:", formData)
      goToNextStep()
    }
  }

  const isLastStep = currentStep === steps.length - 2
  const isComplete = currentStep === steps.length - 1

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-center mb-6">
          <SariBooksLogo />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Complete Your Setup</h1>
          <p className="text-center text-muted-foreground">
            Let's set up your business profile to get started with SariBooksPH
          </p>
        </div>

        <StepIndicator steps={steps.map((step) => step.title)} currentStep={currentStep} />

        <div className="mt-8 min-h-[450px]">{steps[currentStep].component}</div>

        {!isComplete && (
          <StepNavigation
            currentStep={currentStep}
            goToNextStep={isLastStep ? handleSubmit : goToNextStep}
            goToPreviousStep={goToPreviousStep}
            isLastStep={isLastStep}
          />
        )}
      </CardContent>
    </Card>
  )
}
