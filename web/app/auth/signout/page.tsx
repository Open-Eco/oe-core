"use client"

import { signOut } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push("/auth/signin")
      router.refresh()
    })
  }, [router])

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      Signing out...
    </div>
  )
}

