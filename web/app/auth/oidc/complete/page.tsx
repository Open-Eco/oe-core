"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function OIDCCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [signInError, setSignInError] = useState<string | null>(null);
  const error = !userId ? "Missing user ID" : signInError;

  useEffect(() => {
    if (!userId) {
      setTimeout(() => router.push("/auth/signin?error=missing_user_id"), 2000);
      return;
    }

    // Sign in using credentials provider with userId
    signIn("credentials", {
      userId,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        setSignInError("Failed to sign in");
        setTimeout(() => router.push("/auth/signin?error=signin_failed"), 2000);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  }, [userId, router]);

  return (
    <div>
      {error ? (
        <div style={{ color: "#c33" }}>{error}</div>
      ) : (
        <div>Completing sign in...</div>
      )}
    </div>
  );
}

export default function OIDCCompletePage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <Suspense fallback={<div>Loading...</div>}>
        <OIDCCompleteContent />
      </Suspense>
    </div>
  );
}
