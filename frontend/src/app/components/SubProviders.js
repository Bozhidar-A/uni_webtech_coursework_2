'use client';

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import LoadingWait from "./LoadingWait";

export function SubProviders({ children }) {
    const sesh = useSession();
    const path = usePathname();
    const router = useRouter();
    const [isLoadingSession, setIsLoadingSession] = useState(true);


    useEffect(() => {
        //dont display unless we have a session
        //this feels dumb but i feel like i am avoiding a foot gun
        if (sesh?.status === "loading") {
            setIsLoadingSession(true);
        } else {
            setIsLoadingSession(false);
        }

        // self check if refresh token fail from server
        if (sesh?.data?.error === "REFRESH_TOKEN_EXPIRED_ERROR") {
            console.log("Your refresh token has expired. Please log back in. Failed with error:", sesh.data.error);
            signOut(); // Log out user on token refresh failure
        }

        //kick user out of login page if they are already logged in
        if (sesh?.status === "authenticated" && path === "/login") {
            //https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#windowhistoryreplacestate
            // Redirect to home page if user is already logged in
            // window.history.replaceState(null, "", "/");
            router.push("/");
        }

        //protect routes
        const protectedRoutes = [process.env.NEXT_PUBLIC_API_PACKAGES, process.env.NEXT_PUBLIC_API_PACKAGES_UPDATE_DELIVERY_STATUS];
        if (protectedRoutes.includes(path) && sesh?.status !== "authenticated") {
            router.push("/login");
        }
    }, [sesh]);

    return (
        <>
            {isLoadingSession ? <LoadingWait /> : <div><Header />{children}</div>}
        </>
    )



}