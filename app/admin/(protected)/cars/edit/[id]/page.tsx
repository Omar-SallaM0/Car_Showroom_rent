import { redirect } from "next/navigation";

interface LegacyEditPageProps {
  params: { id: string };
}

export default function AdminCarEditLegacyPage({ params }: LegacyEditPageProps) {
  redirect(`/admin/vehicles/edit/${encodeURIComponent(params.id || "")}`);
}