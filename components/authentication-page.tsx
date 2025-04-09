"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./auth/login-form"
import RegisterForm from "./auth/register-form"
import SariBooksLogo from "./saribooks-logo"

export type AuthData = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default function AuthenticationPage() {
  const [authData, setAuthData] = useState<AuthData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const router = useRouter()

  const handleLogin = (data: Partial<AuthData>) => {
    console.log("Login with:", data)
    // In a real app, you would authenticate with your backend here
    // For demo purposes, we'll just redirect to the onboarding page
    router.push("/onboarding")
  }

  const handleRegister = (data: AuthData) => {
    console.log("Register with:", data)
    // In a real app, you would register with your backend here
    // For demo purposes, we'll just redirect to the onboarding page
    router.push("/onboarding")
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-center mb-6">
          <SariBooksLogo />
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSubmit={handleLogin} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSubmit={handleRegister} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
