"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { FullScreenLoader } from "@/components/shared/full-screen-loader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <FullScreenLoader />;
  }

  return (
      <div className="flex min-h-screen bg-background">
          <SidebarProvider>
              <AppSidebar />
              <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
          </SidebarProvider>
      </div>
  );
}
