import { BookOpen, Calculator } from "lucide-react"

export default function SariBooksLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center bg-emerald-600 text-white p-2 rounded-lg">
        <BookOpen className="w-6 h-6 mr-1" />
        <Calculator className="w-6 h-6" />
      </div>
      <span className="text-2xl font-bold text-emerald-600">SariBooksPH</span>
    </div>
  )
}
