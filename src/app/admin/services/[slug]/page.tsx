import { AdminServiceDetailPage } from "@/features/admin/pages/AdminServiceDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AdminServiceDetailPage slug={slug} />;
}
