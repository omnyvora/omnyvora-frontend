import { PortfolioPreviewPage } from "@/features/portfolio/pages/PortfolioPreviewPage";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortfolioPreviewPage instanceId={Number(id)} />;
}
