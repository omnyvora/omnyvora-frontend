import { Terminal } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";

export default function Page() {
  return (
    <Page>
      <PageHead title="Logs" subtitle="System event stream." />
      <EmptyState
        icon={Terminal}
        title="Logs coming soon"
        desc="A filterable event stream lands here in a follow-up step."
      />
    </Page>
  );
}
