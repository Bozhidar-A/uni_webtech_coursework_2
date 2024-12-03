'use client';

import { signIn, signOut } from "next-auth/react";
import useAuth from "./hooks/useAuth";

export default function Home() {
  const auth = useAuth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <button onClick={signIn}><h1 className="text-5xl">Welcome to the manager service. Please click here log in.</h1></button>
        <button onClick={() => signOut()}>
          Sign out
        </button>
        <p>{JSON.stringify(auth)}</p>
      </main>
    </div>
  )
}
