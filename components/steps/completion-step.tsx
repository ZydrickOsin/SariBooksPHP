import type { FormData } from "../onboarding-wizard"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StepProps {
  formData: FormData
}

export default function CompletionStep({ formData }: StepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-emerald-100 p-3 mb-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Thank you, {formData.firstName}. Your business profile has been set up successfully. You're now ready to
        simplify your bookkeeping and tax compliance with SariBooksPH.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 w-full max-w-md mb-6">
        <h3 className="font-medium mb-3">Business Profile</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground text-left">Business:</div>
          <div className="text-right font-medium">{formData.businessName}</div>

          <div className="text-muted-foreground text-left">Business Type:</div>
          <div className="text-right font-medium">{formData.businessType}</div>

          <div className="text-muted-foreground text-left">TIN:</div>
          <div className="text-right font-medium">{formData.tinNumber}</div>

          <div className="text-muted-foreground text-left">VAT Status:</div>
          <div className="text-right font-medium">{formData.vatRegistered ? "VAT Registered" : "Non-VAT"}</div>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-md">
        <Link href="/dashboard" passHref>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Go to Dashboard</Button>
        </Link>
        <Button variant="outline" className="w-full">
          Watch Tutorial
        </Button>
      </div>
    </div>
  )
}
