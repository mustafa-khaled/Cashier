"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/modules/auth/client/hooks";

export function LogoutButton() {
  const { logout, isPending } = useLogout();

  return (
    <Button
      variant="outline"
      size="sm"
      className="min-h-12"
      onClick={() => logout()}
      disabled={isPending}
    >
      {isPending ? "جارٍ الخروج…" : "تسجيل الخروج"}
    </Button>
  );
}
