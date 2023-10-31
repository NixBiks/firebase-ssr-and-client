import { config } from "@/lib/config";
import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  initializeAuth,
  signInWithEmailAndPassword,
  inMemoryPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import {
  initializeFirestore,
  Firestore,
  getFirestore,
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
    persistence: browserLocalPersistence,
  });
  firestore = initializeFirestore(app, {});
} catch {
  app = getApp(appName);
  auth = getAuth(app);
  firestore = getFirestore(app);
}

const signIn = async (username: string, password: string) => {
  const user = await signInWithEmailAndPassword(auth, username, password);
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
const signOut = async () => {
  await auth.signOut();
  const response = await fetch("/auth/sign-out", {
    method: "POST",
  });
  if (response.ok) {
    return;
  } else {
    throw new Error("Failed to sign out server side");
  }
};
const onAuthStateChanged = auth.onAuthStateChanged.bind(auth);
const onIdTokenChanged = auth.onIdTokenChanged.bind(auth);
export {
  auth,
  firestore,
  signIn,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
};
