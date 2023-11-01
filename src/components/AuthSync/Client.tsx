"use client";

import { onAuthStateChanged, signOut } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import React from "react";

const Client = ({
  children,
  serverUid,
}: {
  children: React.ReactNode;
  serverUid?: string;
}) => {
  const router = useRouter();
  React.useEffect(() => {
    return onAuthStateChanged((user) => {
      // if the server and client are out of sync (e.g. by manually deleting cookie/token), sign out both to be safe
      if (serverUid !== user?.uid) {
        signOut().then(() => {
          router.push("/login");
        });
      }
    });
  }, [serverUid, router]);
  return <>{children}</>;
};

export { Client };
