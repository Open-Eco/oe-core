"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";

export default function DemoIndexPage() {
  const router = useRouter();
  const { organizations } = useDemo();

  useEffect(() => {
    if (organizations.length === 0) {
      router.push("/demo/organizations/new");
    } else {
      router.push("/demo/dashboard");
    }
  }, [organizations, router]);

  return (
    <div className="eco-app-shell__loading">
      <span>Loading demo…</span>
    </div>
  );
}

