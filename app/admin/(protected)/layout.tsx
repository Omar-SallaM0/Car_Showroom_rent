import { requireAdminPage } from "@/utils/admin-auth";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <>{children}</>;
}