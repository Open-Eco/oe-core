import { NextResponse } from "next/server"
import { signOut } from "next-auth/react"

export async function POST() {
  // This is handled client-side, but we can add server-side logic here if needed
  return NextResponse.json({ message: "Signed out" })
}

