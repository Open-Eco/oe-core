"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";

export default function DemoIndexPage() {
  const router = useRouter();
  const { organizations } = useDemo();

  useEffect(() => {
    // Seed data is loaded asynchronously; once available, go to the dashboard.
    // Fall back to org creation only if seeding somehow produced no orgs.
    if (organizations.length > 0) {
      router.push("/demo/dashboard");
    }
  }, [organizations, router]);

  return (
    <div className="eco-app-shell__loading">
      <span>Loading demo…</span>
    </div>
  );
}

