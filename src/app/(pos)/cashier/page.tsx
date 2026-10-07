import type { Metadata } from "next";

import { getAuthContext } from "@/modules/auth";
import { CashierScreen } from "@/modules/orders";

export const metadata: Metadata = {
  title: "نقطة البيع",
};

export default async function CashierPage() {
  const context = await getAuthContext();
  const cashierEmail = "email" in context ? context.email : "";

  return <CashierScreen cashierEmail={cashierEmail} />;
}
