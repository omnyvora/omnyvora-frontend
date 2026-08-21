import { PortfolioPublishPage } from "@/features/portfolio/pages/PortfolioPublishPage";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortfolioPublishPage instanceId={Number(id)} />;
}
