"use client";

import { Company } from "@/lib/firebase/schemas";
import { Firestore } from "@/lib/firebase/client";
import React from "react";

export default function Client({ serverData }: { serverData: Company }) {
  const client = Firestore();
  const [company, setCompany] = React.useState<Company>(serverData);

  // Subscribe to changes
  React.useEffect(() => {
    return client.onCompanyChange(company.id, (company) => {
      setCompany(company);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);
  return (
    <div>
      <h1>{company.id}</h1>
      <pre>{JSON.stringify(company, null, 2)}</pre>
    </div>
  );
}
