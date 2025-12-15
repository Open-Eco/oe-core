import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard (or sign in if not authenticated)
  redirect("/dashboard")
}
