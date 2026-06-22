"use client";

import { useSearchParams } from "next/navigation";
import { PasswordResetRequestForm } from "@/components/auth/password-reset-request-form";
import { PasswordUpdateForm } from "@/components/auth/password-update-form";

export function ResetPasswordRouter() {
  const searchParams = useSearchParams();
  // Supabase's recovery redirect includes a `code` param (PKCE flow) or
  // hash-based tokens. The presence of `code` is the most reliable signal
  // that this page load originated from a clicked email link.
  const hasRecoveryCode = searchParams.has("code");

  return hasRecoveryCode ? (
    <PasswordUpdateForm />
  ) : (
    <PasswordResetRequestForm />
  );
}
