"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  passwordResetRequestSchema,
  type PasswordResetRequestValues,
} from "@/lib/validators/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function PasswordResetRequestForm() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequestValues>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  const onSubmit = async (values: PasswordResetRequestValues) => {
    setIsSubmitting(true);
    try {
      const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        { redirectTo }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="text-center">
        <Mail className="mx-auto mb-3 h-10 w-10 text-brand-accent" />
        <h2 className="text-lg font-semibold text-white">Check your email</h2>
        <p className="mt-2 text-sm text-brand-textSecondary">
          If an account exists for that email, we&apos;ve sent a password
          reset link. It&apos;ll expire after a short time, so use it soon.
        </p>
        <Link href="/login">
          <Button variant="secondary" className="mt-6 w-full">
            Back to login
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
          size="lg"
        >
          Send reset link
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-brand-textSecondary hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to login
      </Link>
    </Card>
  );
}
