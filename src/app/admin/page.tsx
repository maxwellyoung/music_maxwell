"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    const user = session?.user as { role?: string } | undefined;
    if (!user || user.role !== "admin") {
      router.replace("/"); // Redirect non-admins
    }
  }, [session, status, router]);

  const user = session?.user as { role?: string } | undefined;
  if (status === "loading" || !user || user.role !== "admin") {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto py-12">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      {/* Add admin controls here: topics, users, reports, etc. */}
      <div className="rounded-xl border bg-background p-8 shadow">
        <p>Welcome, admin! Here you can manage topics, users, and more.</p>
        {/* Example: <AdminTopicsTable /> <AdminUsersTable /> */}
      </div>
    </main>
  );
}
