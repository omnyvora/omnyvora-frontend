import { Server } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";

export default function Page() {
  return (
    <Page>
      <PageHead title="Services" subtitle="Manage availability and access across the platform." />
      <EmptyState
        icon={Server}
        title="Services coming soon"
        desc="Usage and enable/disable controls land here in a follow-up step."
      />
    </Page>
  );
}
