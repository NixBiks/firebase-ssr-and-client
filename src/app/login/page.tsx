"use client";

import { signIn, signOut } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
const Page = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!username || !password) {
      return;
    }
    signIn(username, password)
      .then(() => {
        router.push("/app");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSignOut = () => {
    setError(null);
    signOut().catch((error) => {
      setError(error.message);
    });
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <label>Username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleSignOut}>Logout</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Page;
