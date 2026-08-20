"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { describeApiError } from "@/core/utils/applyServerErrors";
import { Settings, Lock, Server, Bell } from "lucide-react";
import { Page, PageHead, SubNav } from "@/shared/workspace/components/ui";
import { useAdminSettings, useUpdateAdminSettings, useAdminServices, useToggleService } from "../hooks";
import { useAdminStore } from "../store";
import { AdminSettingsFormSchema, type AdminSettingsFormValues } from "../types";
import { SettingsTabPanel, SettingsRow } from "../components/SettingsTabPanel";
import { ServiceAdminCard } from "../components/ServiceAdminCard";

const SUB_NAV = [
  { id: "platform" as const, label: "Platform", icon: Settings },
  { id: "auth" as const, label: "Auth & OTP", icon: Lock },
  { id: "services" as const, label: "Services", icon: Server },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
];

function ToggleControl({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      <span className="thumb" />
    </label>
  );
}

export function AdminSettingsPage() {
  const router = useRouter();
  const settingsTab = useAdminStore((s) => s.settingsTab);
  const setSettingsTab = useAdminStore((s) => s.setSettingsTab);

  const { data: settings, isLoading } = useAdminSettings();
  const update = useUpdateAdminSettings();

  // z.coerce.number() fields (session_timeout_minutes, otp_code_lifetime_minutes)
  // have a permissive pre-coercion input type — useForm must be typed with the
  // schema's input shape, not AdminSettingsFormValues (the post-coercion output),
  // or zodResolver's inferred Resolver type won't match.
  const form = useForm<z.input<typeof AdminSettingsFormSchema>, unknown, AdminSettingsFormValues>({
    resolver: zodResolver(AdminSettingsFormSchema),
  });

  useEffect(() => {
    if (settings) form.reset(settings);
  }, [settings, form]);

  async function onSubmit(values: AdminSettingsFormValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Settings saved");
    } catch (err) {
      toast.error("Failed to save settings", {
        description: describeApiError(err),
      });
    }
  }

  const { data: services = [], isLoading: loadingServices } = useAdminServices();
  const toggleService = useToggleService();

  if (isLoading || !settings) {
    return (
      <Page>
        <PageHead title="Settings" subtitle="Platform configuration." />
        <div className="skel" style={{ height: 320 }} />
      </Page>
    );
  }

  const values = form.watch();

  return (
    <Page>
      <PageHead title="Settings" subtitle="Platform configuration." />

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>
        <SubNav items={SUB_NAV} value={settingsTab} onChange={(id) => setSettingsTab(id as typeof settingsTab)} width={220} />

        {settingsTab === "services" ? (
          <div>
            {loadingServices ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                {[1, 2, 3, 4].map((i) => <div key={i} className="skel" style={{ height: 150 }} />)}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
                {services.map((service) => (
                  <ServiceAdminCard
                    key={service.id}
                    service={service}
                    disabled={toggleService.isPending}
                    onToggle={(isActive) => toggleService.mutate({ slug: service.slug, isActive })}
                    onOpen={() => router.push(service.adminPath)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {settingsTab === "platform" && (
              <SettingsTabPanel
                title="Platform" desc="Core configuration for the Omnyvora instance."
                onCancel={() => form.reset(settings)} saving={update.isPending}
              >
                <SettingsRow title="Maintenance mode" desc="Take the platform offline for all non-admin users.">
                  <ToggleControl checked={values.maintenance_mode} onChange={(v) => form.setValue("maintenance_mode", v, { shouldDirty: true })} />
                </SettingsRow>
                <SettingsRow title="Allow new sign-ups" desc="Permit account registration from the public site.">
                  <ToggleControl checked={values.allow_signups} onChange={(v) => form.setValue("allow_signups", v, { shouldDirty: true })} />
                </SettingsRow>
                <SettingsRow title="Default region" desc="Primary data residency for new accounts.">
                  <input className="input" style={{ width: 160 }} {...form.register("default_region")} />
                </SettingsRow>
                <SettingsRow title="Session timeout" desc="Idle minutes before users are signed out.">
                  <input className="input" type="number" min={1} style={{ width: 100 }} {...form.register("session_timeout_minutes")} />
                </SettingsRow>
              </SettingsTabPanel>
            )}

            {settingsTab === "auth" && (
              <SettingsTabPanel
                title="Auth & OTP" desc="Authentication, sessions, and one-time passcodes."
                onCancel={() => form.reset(settings)} saving={update.isPending}
              >
                <SettingsRow title="Require OTP on login" desc="Send a one-time passcode for every sign-in.">
                  <ToggleControl checked={values.require_otp_on_login} onChange={(v) => form.setValue("require_otp_on_login", v, { shouldDirty: true })} />
                </SettingsRow>
                <SettingsRow title="OTP delivery" desc="Channel used to deliver verification codes.">
                  <select className="input" style={{ width: 140 }} {...form.register("otp_delivery_channel")}>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="all">All</option>
                  </select>
                </SettingsRow>
                <SettingsRow title="Code lifetime" desc="Minutes an OTP stays valid before expiry.">
                  <input className="input" type="number" min={1} style={{ width: 100 }} {...form.register("otp_code_lifetime_minutes")} />
                </SettingsRow>
                <SettingsRow title="Allow password reset" desc="Let users reset their own password via email.">
                  <ToggleControl checked={values.allow_password_reset} onChange={(v) => form.setValue("allow_password_reset", v, { shouldDirty: true })} />
                </SettingsRow>
              </SettingsTabPanel>
            )}

            {settingsTab === "notifications" && (
              <SettingsTabPanel
                title="Notifications" desc="System and admin alert preferences."
                onCancel={() => form.reset(settings)} saving={update.isPending}
              >
                <SettingsRow title="Email admin alerts" desc="Email super admins on critical system events.">
                  <ToggleControl checked={values.email_admin_alerts} onChange={(v) => form.setValue("email_admin_alerts", v, { shouldDirty: true })} />
                </SettingsRow>
                <SettingsRow title="Weekly digest" desc="A Monday summary of platform activity.">
                  <ToggleControl checked={values.weekly_digest} onChange={(v) => form.setValue("weekly_digest", v, { shouldDirty: true })} />
                </SettingsRow>
                <SettingsRow title="Failed login alerts" desc="Notify on repeated failed sign-in attempts.">
                  <ToggleControl checked={values.failed_login_alerts} onChange={(v) => form.setValue("failed_login_alerts", v, { shouldDirty: true })} />
                </SettingsRow>
                <SettingsRow title="Quota warnings" desc="Alert when a service nears its storage limit.">
                  <ToggleControl checked={values.quota_warnings} onChange={(v) => form.setValue("quota_warnings", v, { shouldDirty: true })} />
                </SettingsRow>
              </SettingsTabPanel>
            )}
          </form>
        )}
      </div>
    </Page>
  );
}
