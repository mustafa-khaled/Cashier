import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppTopbar } from "@/components/shared/app-topbar";
import { getAuthContext } from "@/modules/auth";

export default async function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getAuthContext();

  if (context.status !== "active") {
    redirect("/login");
  }

  return (
    <div className="app-glow flex min-h-dvh flex-col">
      <AppTopbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <AppSidebar />
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
