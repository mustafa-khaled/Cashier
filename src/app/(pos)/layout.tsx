import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getAuthContext } from "@/modules/auth";

export default async function PosLayout({ children }: { children: ReactNode }) {
  const context = await getAuthContext();

  if (context.status !== "active") {
    redirect("/login");
  }

  return <>{children}</>;
}
