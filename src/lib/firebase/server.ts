import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";

try {
  initializeApp();
  console.log("Firebase Admin SDK initialized.");
} catch {
  // Do nothing if the app is already initialized.
}
const auth = admin.auth();

export { auth };
