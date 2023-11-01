import type { Metadata } from "next";
import AuthSync from "@/components/AuthSync";
import { getDecodedIdToken } from "@/lib/firebase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authenticated app",
  description: "All children of this page are authenticated",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const decodedClaims = await getDecodedIdToken(cookies());
  if (!decodedClaims) {
    redirect("/login");
  }

  return <AuthSync>{children}</AuthSync>;
}
