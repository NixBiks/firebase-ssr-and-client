import type { Metadata } from "next";
import { config } from "@/lib/config";
import { auth } from "@/lib/firebase/server";
import { cookies } from "next/headers";
import { AuthSync } from "@/components/AuthSync";
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
  const cookieStore = cookies();
  const authCookie = cookieStore.get(config.firebase.sessionCookieName)?.value;
  if (!authCookie) {
    redirect("/login");
  }
  const decodedClaims = await auth.verifySessionCookie(authCookie);

  return <AuthSync serverUid={decodedClaims.uid}>{children}</AuthSync>;
}
