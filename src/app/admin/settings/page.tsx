import { Settings } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";

export default function Page() {
  return (
    <Page>
      <PageHead title="Settings" subtitle="Platform configuration." />
      <EmptyState
        icon={Settings}
        title="Settings coming soon"
        desc="Platform, auth, services, and notification settings land here in a follow-up step."
      />
    </Page>
  );
}
