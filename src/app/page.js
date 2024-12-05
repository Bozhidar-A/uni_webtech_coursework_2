'use client';

import { signIn, signOut } from "next-auth/react";
import useAuth from "./hooks/useAuth";
import Link from "next/link";

export default function Home() {
  const auth = useAuth();

  return (
    <div className="h-[calc(100vh-56px)] grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {auth?.isAuthenticated ? <Link href={process.env.NEXT_PUBLIC_NAVIGATION_PACKAGES_PAGE}><h1 className="text-5xl">You are logged in. Click here to head to packages</h1></Link> : <Link href={"/login"}><h1 className="text-5xl">Welcome to the manager service. Please click here log in.</h1></Link>}
        <p>{JSON.stringify(auth)}</p>
      </main>
    </div>
  )
}
