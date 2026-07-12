import { LayoutDashboard } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";

export default function Page() {
  return (
    <Page>
      <PageHead title="Admin Dashboard" subtitle="Platform-wide activity and health." />
      <EmptyState
        icon={LayoutDashboard}
        title="Dashboard coming soon"
        desc="KPIs, growth, and platform alerts land here in a follow-up step."
      />
    </Page>
  );
}
