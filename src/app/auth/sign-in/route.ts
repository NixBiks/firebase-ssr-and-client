import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { auth } from "@/lib/firebase/server";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  // check idToken is in body
  const body = await request.json();
  const idToken = body.idToken;
  // const csrfToken = request.body.csrfToken.toString();

  if (idToken) {
    const decodedToken = await auth.verifyIdToken(idToken);

    if (decodedToken) {
      //Generate session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn,
      });

      const options = {
        name: config.firebase.sessionCookieName,
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      //Add the cookie to the browser
      cookies().set(options);
    }
  } else {
    return Response.json({ error: "No idToken provided" }, { status: 400 });
  }

  return Response.json({ message: "cookie set" }, { status: 200 });
}
