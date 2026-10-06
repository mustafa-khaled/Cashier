"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { authKeys } from "@/modules/auth/client/query-keys";
import { authMutations } from "@/modules/auth/client/queries";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useMutation({
    ...authMutations.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.context() });
      router.push("/login");
      router.refresh();
    },
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      {logout.isPending ? "جارٍ الخروج…" : "تسجيل الخروج"}
    </Button>
  );
}
