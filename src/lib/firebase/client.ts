import { config } from "@/lib/config";
import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  initializeAuth,
  signInWithEmailAndPassword,
  indexedDBLocalPersistence,
} from "firebase/auth";
import {
  initializeFirestore,
  Firestore,
  getFirestore,
  onSnapshot,
  doc,
} from "firebase/firestore";

const { sessionCookieName, ...firebaseConfig } = config.firebase;

const appName = "ssr";
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
try {
  app = initializeApp(firebaseConfig, appName);
  console.log(
    `Initializing firestore app '${appName}' with config: ${JSON.stringify(
      firebaseConfig
    )}`
  );
  auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  });
  firestore = initializeFirestore(app, {});
} catch {
  app = getApp(appName);
  auth = getAuth(app);
  firestore = getFirestore(app);
}

const signIn = async (username: string, password: string) => {
  // sign in client side
  const user = await signInWithEmailAndPassword(auth, username, password);

  // sign in server side
  if (user.user) {
    const response = await fetch("/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: await user.user.getIdToken() }),
    });
    if (response.ok) {
      return user.user;
    } else {
      throw new Error("Failed to sign in server side");
    }
  } else {
    throw new Error("User not found");
  }
};
const signOutServerSide = async () => {
  const response = await fetch("/auth/sign-out", {
    method: "POST",
  });
  if (response.ok) {
    return;
  } else {
    throw new Error("Failed to sign out server side");
  }
};
const signOutClientSide = auth.signOut.bind(auth);
const signOut = async () => {
  // sign out client side
  await signOutClientSide();

  // sign out server side
  return await signOutServerSide();
};
const onSnapshotCompanySnapshot = (companyId: string, callback: any) => {
  const docRef = doc(firestore, `companies/${companyId}`);
  return onSnapshot(docRef, callback);
};
const onAuthStateChanged = auth.onAuthStateChanged.bind(auth);
export {
  auth,
  firestore,
  signIn,
  signOut,
  signOutClientSide,
  signOutServerSide,
  onSnapshotCompanySnapshot,
  onAuthStateChanged,
};
