import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { config } from "@/lib/config";
import React from "react";
import { company } from "./schemas";
import { parse } from "valibot";

type Role = "admin" | "premium" | "publisher" | "basic";
type CookieStore = ReturnType<typeof cookies>;
try {
  initializeApp();
  console.log("Firebase Admin SDK initialized.");
} catch {
  // Do nothing if the app is already initialized.
}
const auth = admin.auth();
const firestore = admin.firestore();
const getDecodedIdToken = React.cache(async (cookieStore: CookieStore) => {
  console.log("getDecodedIdToken");

  const sessionCookie = cookieStore.get(
    config.firebase.sessionCookieName
  )?.value;
  if (!sessionCookie) {
    return null;
  }
  return await auth.verifySessionCookie(sessionCookie, true);
});

const hasAnyRole = async (
  roleOrRoles: Role | Role[],
  cookieStore: CookieStore
) => {
  const decodedIdToken = await getDecodedIdToken(cookieStore);
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  if (!decodedIdToken) {
    return false;
  }
  return roles.some((role) => !!decodedIdToken[role]);
};

class Firestore {
  private cookies: CookieStore;
  constructor(cookies: CookieStore) {
    this.cookies = cookies;
  }
  async getCompany(id: string) {
    const hasRequiredRole = await hasAnyRole(
      ["admin", "publisher"],
      this.cookies
    );
    if (!hasRequiredRole) {
      return { error: "Missing read access to companies" };
    }
    const companySnapshot = await firestore.doc(`companies/${id}`).get();
    if (!companySnapshot.exists) {
      return { error: `${id} is not a valid company` };
    }
    return { data: parse(company, companySnapshot.data()) };
  }
}

export { auth, getDecodedIdToken, hasAnyRole, Firestore };
