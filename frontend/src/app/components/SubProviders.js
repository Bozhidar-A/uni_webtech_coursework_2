'use client';

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export function SubProviders({ children }) {
    const sesh = useSession();

    useEffect(() => {
        console.log("Session:", sesh);
        // self check if refresh token fail from server
        if (sesh?.data?.error === "REFRESH_TOKEN_EXPIRED_ERROR") {
            console.error("Your refresh token has expired. Please log back in. Failed with error:", sesh.data.error);
            signOut(); // Log out user on token refresh failure
        }
    }, [sesh]);

    return (
        <>
            {children}
        </>
    )
}