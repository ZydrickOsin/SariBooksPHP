import { CheckCircle2 } from "lucide-react"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between items-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Line before */}
              {index > 0 && <div className={`h-1 flex-1 ${index <= currentStep ? "bg-emerald-600" : "bg-gray-200"}`} />}

              {/* Circle */}
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full 
                  ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                        ? "border-2 border-emerald-600 text-emerald-600"
                        : "border-2 border-gray-200 text-gray-400"
                  }
                `}
              >
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span>{index + 1}</span>}
              </div>

              {/* Line after */}
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 ${index < currentStep ? "bg-emerald-600" : "bg-gray-200"}`} />
              )}
            </div>

            <span
              className={`
                mt-2 text-xs font-medium hidden sm:block
                ${isCurrent ? "text-emerald-600" : isCompleted ? "text-gray-700" : "text-gray-400"}
              `}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
