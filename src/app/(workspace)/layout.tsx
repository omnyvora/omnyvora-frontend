export const dynamic = "force-dynamic";

import { AuthGuard } from "@/shared/auth/guards/AuthGuard";
import { Sidebar } from "@/shared/workspace/components/Sidebar";
import { Topbar } from "@/shared/workspace/components/Topbar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
