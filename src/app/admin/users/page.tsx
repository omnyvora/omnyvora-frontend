import { Users } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";

export default function Page() {
  return (
    <Page>
      <PageHead title="Users" subtitle="Search accounts and view details." />
      <EmptyState
        icon={Users}
        title="Users coming soon"
        desc="Search, list, and account detail land here in a follow-up step."
      />
    </Page>
  );
}
