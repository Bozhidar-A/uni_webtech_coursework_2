import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function useAuth(redirectTo = "/login") {
    const { data: session, status } = useSession();
    const [error, setError] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    // const protectedPages = [
    //     "/packages/*",
    // ];

    // // Redirect if unauthenticated
    // useEffect(() => {
    //     //wait for session to load
    //     if (status === "loading") return;

    //     const isProtectedRoute = protectedPages.some((sub) => {
    //         return matchPattern(sub, pathname);
    //     })

    //     if (status === "unauthenticated" && isProtectedRoute) {
    //         router.push(redirectTo); // Redirect to login
    //     }

    //     //if authenticated and on login page, redirect to home
    //     console.log(process.env.NEXT_PUBLIC_API_AUTH_LOGIN);
    //     console.log(pathname);
    //     if (status === "authenticated" && pathname === process.env.NEXT_PUBLIC_API_AUTH_LOGIN) {
    //         router.push("/");
    //     }
    // }, [status, redirectTo, router]);

    // // Proactively refresh tokens if the access token is expired
    // useEffect(() => {
    //     if (session?.accessToken && session.accessTokenExpires && Date.now() > session.accessTokenExpires) {
    //         refreshTokens();
    //     }
    // }, [session]);

    // // Function to refresh tokens
    // const refreshTokens = async () => {
    //     try {
    //         const response = await fetch("/api/auth/session", { method: "GET" });
    //         const updatedSession = await response.json();

    //         if (updatedSession.error) {
    //             throw new Error(updatedSession.error);
    //         }
    //     } catch (err) {
    //         console.error("Failed to refresh session:", err);
    //         setError("Session expired, please log in again.");
    //         signOut(); // Log out user on token refresh failure
    //     }
    // };

    // // Handle API requests with token validation
    // const handleRequest = async (url, options = {}) => {
    //     // Check if token is expired and refresh it before making the request
    //     if (session?.accessTokenExpires && Date.now() > session.accessTokenExpires) {
    //         try {
    //             await refreshTokens();
    //         } catch {
    //             throw new Error("Unable to refresh token. Please log in again.");
    //         }
    //     }

    //     if (!options.headers) {
    //         options.headers = {
    //             "Content-Type": "application/json",
    //         };
    //     }



    //     const response = await fetch(url, {
    //         ...options,
    //         headers: {
    //             ...options.headers,
    //             Authorization: `Bearer ${session?.accessToken}`,
    //         },
    //     });

    //     console.log(response);

    //     // If the request fails due to token issues, attempt to refresh and retry
    //     if (!response.ok) {
    //         try {
    //             await refreshTokens();
    //             const retryResponse = await fetch(url, {
    //                 ...options,
    //                 headers: {
    //                     ...options.headers,
    //                     Authorization: `Bearer ${session?.accessToken}`,
    //                 },
    //             });
    //             if (!retryResponse.ok) throw new Error("Request failed after retry");
    //             return retryResponse.json();
    //         } catch (err) {
    //             setError("Failed to refresh session. Please log in again.");
    //             signOut(); // Log out if refresh and retry fail
    //             throw err;
    //         }
    //     }

    //     return response.json();
    // };

    return {
        session,
        status,
        // error,
        // handleRequest,
    };
}
