'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { matchPattern } from "url-matcher";

export default function useAuth(shouldRedirect) {
    const { data: session, status } = useSession(); // Session data and status (loading, authenticated, etc.)
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const protectedPages = [
        "/packages/*",
    ];

    useEffect(() => {

        // If session is loading, do nothing
        if (status === "loading") return;

        // If session is null (unauthenticated user)
        if (session === null) {
            const isProtectedRoute = matchPattern(protectedPages[0], pathname);

            if (isProtectedRoute) {
                console.log("Redirecting to login (unauthenticated)");
                router.replace('/login');
            }

            setIsAuthenticated(false); // Not authenticated
        } else {
            // If session is available (authenticated user)
            if (pathname === '/login') {
                console.log("Redirecting to home (authenticated user on login page)");
                router.replace('/'); // Redirect to home if user is authenticated and on login page
            }

            setIsAuthenticated(true); // Authenticated
        }
    }, [session, pathname, status, shouldRedirect]);

    return isAuthenticated;
}
