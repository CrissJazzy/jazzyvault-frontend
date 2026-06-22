"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  passwordUpdateSchema,
  type PasswordUpdateValues,
} from "@/lib/validators/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PasswordUpdateForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordUpdateValues>({
    resolver: zodResolver(passwordUpdateSchema),
  });

  useEffect(() => {
    // Supabase fires a PASSWORD_RECOVERY event once it has parsed the
    // recovery token from the URL and established a temporary session.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsReady(true);
      }
    });

    // Fallback: if a session already exists when this page mounts
    // (e.g. the event fired before this listener attached), allow
    // the form to render rather than getting stuck.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsReady(true);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: PasswordUpdateValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSuccess(true);
      toast.success("Password updated successfully.");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Password updated</h2>
        <p className="mt-2 text-sm text-brand-textSecondary">
          Redirecting you to your dashboard…
        </p>
      </Card>
    );
  }

  if (!isReady) {
    return (
      <Card className="text-center">
        <p className="text-sm text-brand-textSecondary">
          Verifying your reset link…
        </p>
        <p className="mt-2 text-xs text-brand-textSecondary/60">
          If this doesn&apos;t resolve, the link may have expired — request a
          new one from the login page.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
          size="lg"
        >
          Update password
        </Button>
      </form>
    </Card>
  );
}
