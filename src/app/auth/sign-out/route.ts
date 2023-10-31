import { cookies } from "next/headers";
import { config } from "@/lib/config";
import { auth } from "@/lib/firebase/server";
import { redirect } from "next/navigation";

export async function POST() {
  const cookieStore = cookies();
  const cookie = cookieStore.get(config.firebase.sessionCookieName);

  // remove the cookie
  cookieStore.delete(config.firebase.sessionCookieName);

  // revoke the session
  if (cookie) {
    const decodedClaims = await auth.verifySessionCookie(cookie.value);
    await auth.revokeRefreshTokens(decodedClaims.sub);
  }
  // redirect to home
  redirect("/");

  return Response.json({ message: "cookie removed" }, { status: 200 });
}
