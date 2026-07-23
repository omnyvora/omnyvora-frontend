"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";
import { Page, PageHead, SubNav } from "@/shared/workspace/components/ui";
import { PublicProfileSection } from "@/features/profile/pages/ProfilePage";
import { IdentityPanel } from "@/features/user-data/pages/IdentityPanel";

const SUB_NAV = [
  { id: "public",   label: "Public profile", icon: User },
  { id: "identity", label: "Identity",       icon: Star },
];

export default function ProfilePage() {
  const [sub, setSub] = useState("public");

  return (
    <Page>
      <PageHead title="Profile" subtitle="Manage how you appear across Omnyvora." />
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }}>
        <SubNav width={200} value={sub} onChange={setSub} items={SUB_NAV} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {sub === "public"   && <PublicProfileSection />}
          {sub === "identity" && <IdentityPanel />}
        </div>
      </div>
    </Page>
  );
}
