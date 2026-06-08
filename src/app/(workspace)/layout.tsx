export const dynamic = "force-dynamic";

import { AuthGuard } from "@/shared/auth/guards/AuthGuard";
import { Sidebar } from "@/shared/workspace/components/Sidebar";
import { NotificationsDrawer } from "@/shared/notifications/NotificationsDrawer";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-background">
          {children}
        </main>
      </div>
      <NotificationsDrawer />
    </AuthGuard>
  );
}
