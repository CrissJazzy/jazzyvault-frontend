import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordRouter } from "@/components/auth/reset-password-router";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll help you get back into your vault"
    >
      <Suspense fallback={null}>
        <ResetPasswordRouter />
      </Suspense>
    </AuthLayout>
  );
}
