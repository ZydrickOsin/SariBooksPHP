"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import BusinessInfoStep from "./steps/business-info-step"
import TaxInfoStep from "./steps/tax-info-step"
import BookkeepingPreferencesStep from "./steps/bookkeeping-preferences-step"
import CompletionStep from "./steps/completion-step"
import StepIndicator from "./step-indicator"
import StepNavigation from "./step-navigation"
import SariBooksLogo from "./saribooks-logo"
import { saveBusinessInfo, saveTaxInfo, savePreferences, completeOnboarding } from "@/app/actions/onboarding-actions"

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
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const router = useRouter()

  // In a real app, you would fetch user data here
  useEffect(() => {
    // Simulate fetching user data
    setFormData((prev) => ({
      ...prev,
      firstName: "Juan",
      lastName: "Dela Cruz",
      email: "juan@example.com",
    }))
  }, [])

  const steps = [
    {
      title: "Business",
      component: (
        <BusinessInfoStep formData={formData} updateFormData={setFormData} errors={errors} isLoading={isLoading} />
      ),
      validate: async () => {
        setIsLoading(true)
        setGeneralError("")
        setErrors({})

        // Create FormData object for server action
        const submitData = new FormData()
        submitData.append("businessName", formData.businessName)
        submitData.append("businessType", formData.businessType)
        submitData.append("businessSize", formData.businessSize)
        submitData.append("industry", formData.industry)
        submitData.append("businessAddress", formData.businessAddress)

        try {
          const result = await saveBusinessInfo(submitData)

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

            setIsLoading(false)
            return false
          }

          setIsLoading(false)
          return true
        } catch (error) {
          setGeneralError("An unexpected error occurred. Please try again.")
          setIsLoading(false)
          return false
        }
      },
    },
    {
      title: "Tax Info",
      component: <TaxInfoStep formData={formData} updateFormData={setFormData} errors={errors} isLoading={isLoading} />,
      validate: async () => {
        setIsLoading(true)
        setGeneralError("")
        setErrors({})

        // Create FormData object for server action
        const submitData = new FormData()
        submitData.append("tinNumber", formData.tinNumber)
        submitData.append("vatRegistered", formData.vatRegistered.toString())
        submitData.append("fiscalYearEnd", formData.fiscalYearEnd)
        submitData.append("birRegistrationDate", formData.birRegistrationDate)

        try {
          const result = await saveTaxInfo(submitData)

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

            setIsLoading(false)
            return false
          }

          setIsLoading(false)
          return true
        } catch (error) {
          setGeneralError("An unexpected error occurred. Please try again.")
          setIsLoading(false)
          return false
        }
      },
    },
    {
      title: "Preferences",
      component: (
        <BookkeepingPreferencesStep
          formData={formData}
          updateFormData={setFormData}
          errors={errors}
          isLoading={isLoading}
        />
      ),
      validate: async () => {
        setIsLoading(true)
        setGeneralError("")
        setErrors({})

        // Create FormData object for server action
        const submitData = new FormData()
        submitData.append("accountingMethod", formData.accountingMethod)
        submitData.append("chartOfAccounts", formData.chartOfAccounts)
        submitData.append("currencyPreference", formData.currencyPreference)
        submitData.append("digitalReceipts", formData.digitalReceipts.toString())

        try {
          const result = await savePreferences(submitData)

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

            setIsLoading(false)
            return false
          }

          setIsLoading(false)
          return true
        } catch (error) {
          setGeneralError("An unexpected error occurred. Please try again.")
          setIsLoading(false)
          return false
        }
      },
    },
    {
      title: "Complete",
      component: <CompletionStep formData={formData} />,
      validate: () => true,
    },
  ]

  const goToNextStep = async () => {
    const isValid = await steps[currentStep].validate()

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

  const handleSubmit = async () => {
    const isValid = await steps[currentStep].validate()

    if (isValid) {
      try {
        await completeOnboarding()
        goToNextStep()
      } catch (error) {
        setGeneralError("An error occurred while completing onboarding")
      }
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

        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">{generalError}</div>
        )}

        <StepIndicator steps={steps.map((step) => step.title)} currentStep={currentStep} />

        <div className="mt-8 min-h-[450px]">{steps[currentStep].component}</div>

        {!isComplete && (
          <StepNavigation
            currentStep={currentStep}
            goToNextStep={isLastStep ? handleSubmit : goToNextStep}
            goToPreviousStep={goToPreviousStep}
            isLastStep={isLastStep}
            isLoading={isLoading}
          />
        )}
      </CardContent>
    </Card>
  )
}
