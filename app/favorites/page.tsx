import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FavoritesClient from "@/components/FavoritesClient";

export const metadata: Metadata = {
  title: "Favorites | المفضلة | Car Showroom",
  description: "View and manage your favorite cars | استعرض وأدر سياراتك المفضلة",
};

export default function FavoritesPage() {
  return (
    <main className="overflow-hidden min-h-screen pb-16">
      <Navbar />
      <FavoritesClient />
    </main>
  );
}
