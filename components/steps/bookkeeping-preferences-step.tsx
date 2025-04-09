"use client"

import type { FormData } from "../onboarding-wizard"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StepProps {
  formData: FormData
  updateFormData: (data: FormData) => void
  errors: Record<string, string>
}

export default function BookkeepingPreferencesStep({ formData, updateFormData, errors }: StepProps) {
  const handleRadioChange = (value: string) => {
    updateFormData({ ...formData, accountingMethod: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({ ...formData, [name]: value })
  }

  const handleSwitchChange = (checked: boolean) => {
    updateFormData({ ...formData, digitalReceipts: checked })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Bookkeeping Preferences</h2>
        <p className="text-muted-foreground">Customize how SariBooksPH works for your business</p>
      </div>

      <div className="grid gap-6 py-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Accounting Method</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[250px] text-sm">
                    Cash basis records income when received and expenses when paid. Accrual basis records income when
                    earned and expenses when incurred.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup
            value={formData.accountingMethod}
            onValueChange={handleRadioChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Cash Basis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="accrual" id="accrual" />
              <Label htmlFor="accrual">Accrual Basis</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="chartOfAccounts">Chart of Accounts</Label>
          <Select
            value={formData.chartOfAccounts}
            onValueChange={(value) => handleSelectChange("chartOfAccounts", value)}
          >
            <SelectTrigger id="chartOfAccounts">
              <SelectValue placeholder="Select chart of accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Philippine Chart of Accounts</SelectItem>
              <SelectItem value="simplified">Simplified (for Small Businesses)</SelectItem>
              <SelectItem value="custom">Custom (Configure Later)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="currencyPreference">Primary Currency</Label>
          <Select
            value={formData.currencyPreference}
            onValueChange={(value) => handleSelectChange("currencyPreference", value)}
          >
            <SelectTrigger id="currencyPreference">
              <SelectValue placeholder="Select primary currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="digitalReceipts">Enable Digital Receipts</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[250px] text-sm">
                      Store digital copies of receipts and invoices for BIR compliance and easier record-keeping
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch id="digitalReceipts" checked={formData.digitalReceipts} onCheckedChange={handleSwitchChange} />
          </div>
        </div>
      </div>
    </div>
  )
}
