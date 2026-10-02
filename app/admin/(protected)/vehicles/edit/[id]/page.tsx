import VehicleForm from "@/components/admin/VehicleForm";

interface EditPageProps {
  params: { id: string };
}

export default function AdminVehicleEditPage({ params }: EditPageProps) {
  const decodedId = decodeURIComponent(params.id || "");
  return <VehicleForm mode="edit" carId={decodedId} />;
}
