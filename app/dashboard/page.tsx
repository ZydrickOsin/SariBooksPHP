import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth-actions"
import { createServerSupabaseClient } from "@/lib/auth"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  const supabase = createServerSupabaseClient()

  // Get user's business info
  const { data: business } = await supabase
    .from("businesses")
    .select(`
      id,
      name,
      business_type,
      tax_profiles (tin_number, vat_registered)
    `)
    .eq("owner_id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-600">SariBooksPH Dashboard</h1>
          <form action={logout}>
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.first_name}!</h2>
          <p className="text-gray-600">
            Your SariBooksPH account has been set up successfully. You can now start managing your bookkeeping and tax
            compliance.
          </p>

          {business && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Business Profile</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Business:</div>
                <div className="font-medium">{business.name}</div>

                <div className="text-gray-600">Business Type:</div>
                <div className="font-medium">{business.business_type}</div>

                {business.tax_profiles && business.tax_profiles[0] && (
                  <>
                    <div className="text-gray-600">TIN:</div>
                    <div className="font-medium">{business.tax_profiles[0].tin_number}</div>

                    <div className="text-gray-600">VAT Status:</div>
                    <div className="font-medium">
                      {business.tax_profiles[0].vat_registered ? "VAT Registered" : "Non-VAT"}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
              <h3 className="font-medium text-emerald-700 mb-2">Record Transactions</h3>
              <p className="text-sm text-emerald-600 mb-4">Add sales, purchases, and expenses</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
            </div>

            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
              <h3 className="font-medium text-emerald-700 mb-2">Tax Calendar</h3>
              <p className="text-sm text-emerald-600 mb-4">View upcoming tax deadlines</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Calendar</Button>
            </div>

            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
              <h3 className="font-medium text-emerald-700 mb-2">Financial Reports</h3>
              <p className="text-sm text-emerald-600 mb-4">Generate income statements and more</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Reports</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
