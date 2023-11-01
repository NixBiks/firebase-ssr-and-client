import { Firestore } from "@/lib/firebase/server";
import { cookies } from "next/headers";
import Client from "./Client";

export default async function Home({
  params: { id },
}: {
  params: { id: string };
}) {
  const client = new Firestore(cookies());
  const { data: company, error } = await client.getCompany(id);

  if (!company) return <div>Something went wrong: {JSON.stringify(error)}</div>;

  return <Client serverData={company} />;
}
