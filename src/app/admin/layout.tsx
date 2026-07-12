export const dynamic = "force-dynamic";

import { ServiceThemeProvider } from "@/core/design/ServiceThemeProvider";
import { SuperAdminGuard } from "@/shared/auth/guards/SuperAdminGuard";
import { AdminSidebar } from "@/shared/workspace/components/AdminSidebar";
import { NotificationsDrawer } from "@/shared/notifications/NotificationsDrawer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminGuard>
      <ServiceThemeProvider service="admin">
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="flex flex-1 flex-col overflow-y-auto bg-background">
            {children}
          </main>
        </div>
        <NotificationsDrawer />
      </ServiceThemeProvider>
    </SuperAdminGuard>
  );
}
