import { Settings as SettingsIcon } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-brand-textSecondary">
          Manage your profile, password, and account
        </p>
      </div>
      <ComingSoon icon={SettingsIcon} title="Account Settings" phase="Phase 9" />
    </div>
  );
}
