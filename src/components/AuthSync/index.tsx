import { getDecodedIdToken } from "@/lib/firebase/server";
import { cookies } from "next/headers";
import { Client } from "./Client";

export default async function AuthSync({
  children,
}: {
  children: React.ReactNode;
}) {
  const decodedClaims = await getDecodedIdToken(cookies());

  return <Client serverUid={decodedClaims?.uid}>{children}</Client>;
}
