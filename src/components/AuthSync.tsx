"use client";

import {
  onAuthStateChanged,
  signOutClientSide,
  signOutServerSide,
  signOut,
} from "@/lib/firebase/client";
import React from "react";

const AuthSync = ({
  children,
  serverUid,
}: {
  children: React.ReactNode;
  serverUid?: string;
}) => {
  React.useEffect(() => {
    return onAuthStateChanged((user) => {
      console.log(`serverUid: ${serverUid} - clientUid: ${user?.uid}`);

      if (serverUid && !user) {
        return signOutServerSide();
      }
      if (!serverUid && user) {
        return signOutClientSide();
      }
      if (serverUid && user && serverUid !== user.uid) {
        return signOut();
      }
    });
  }, [serverUid]);
  return <>{children}</>;
};

export { AuthSync };
