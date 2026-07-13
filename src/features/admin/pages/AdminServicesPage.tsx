"use client";

import { toast } from "sonner";
import { Server } from "lucide-react";
import { Page, PageHead, EmptyState } from "@/shared/workspace/components/ui";
import { useAdminServices, useToggleService } from "../hooks";
import { ServiceAdminCard } from "../components/ServiceAdminCard";

export function AdminServicesPage() {
  const { data: services = [], isLoading } = useAdminServices();
  const toggleService = useToggleService();

  function handleToggle(slug: string, isActive: boolean) {
    toggleService.mutate(
      { slug, isActive },
      {
        onError: (err) => {
          toast.error("Failed to update service", {
            description: err instanceof Error ? err.message : "Unknown error",
          });
        },
      },
    );
  }

  return (
    <Page>
      <PageHead
        title="Services"
        subtitle={`${services.length} services · manage availability across the platform.`}
      />

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skel" style={{ height: 150 }} />)}
        </div>
      ) : services.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {services.map((service) => (
            <ServiceAdminCard
              key={service.id}
              service={service}
              disabled={toggleService.isPending}
              onToggle={(isActive) => handleToggle(service.slug, isActive)}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={Server} title="No services yet" desc="Services will appear here once added to the catalog." />
      )}
    </Page>
  );
}
