"use client"

import { SessionProvider } from "next-auth/react"
import { DemoProvider } from "@/lib/demo-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DemoProvider>{children}</DemoProvider>
    </SessionProvider>
  )
}

