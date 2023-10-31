import { parse, object, string } from "valibot";

const config = parse(
  object({
    firebase: object({
      apiKey: string(),
      authDomain: string(),
      databaseURL: string(),
      projectId: string(),
      storageBucket: string(),
      messagingSenderId: string(),
      appId: string(),
      measurementId: string(),
      sessionCookieName: string(),
    }),
  }),
  {
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_firebase_apiKey,
      authDomain: process.env.NEXT_PUBLIC_firebase_authDomain,
      databaseURL: process.env.NEXT_PUBLIC_firebase_databaseURL,
      projectId: process.env.NEXT_PUBLIC_firebase_projectId,
      storageBucket: process.env.NEXT_PUBLIC_firebase_storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_firebase_messagingSenderId,
      appId: process.env.NEXT_PUBLIC_firebase_appId,
      measurementId: process.env.NEXT_PUBLIC_firebase_measurementId,
      sessionCookieName: "firebase-session",
    },
  }
);

export { config };
