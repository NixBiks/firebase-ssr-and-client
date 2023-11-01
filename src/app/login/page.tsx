import { getDecodedIdToken } from "@/lib/firebase/server";
import { cookies } from "next/headers";
import React from "react";
import { Login } from "./Login";
import { redirect } from "next/navigation";

const Page = async () => {
  const decodedIdToken = await getDecodedIdToken(cookies());
  if (decodedIdToken) {
    return redirect("/app");
  }

  return <Login />;
};

export default Page;
