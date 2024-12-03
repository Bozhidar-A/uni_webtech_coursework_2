import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function useAuth(redirectTo = "/login") {
    const { data: session, status } = useSession();
    const [error, setError] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("NO_USER_ERROR");

    useEffect(() => {
        if (session?.user) {
            setIsAuthenticated(true);
            setUsername(session.user.username);
        }
    }, [session, status]);

    function RefreshTokens() {
        //calling this reruns auth flow
        //and in turn, token validation/creation/refresh
        const tmp = getSession();
    }

    async function HandleAPIRequest(url, options = {}) {
        // Refresh the tokens before making the API request
        await RefreshTokens();

        if (!options.headers) {
            options.headers = {
                "Content-Type": "application/json",
            };
        }

        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${session?.accessToken}`,
            },
        });
    }

    return {
        session,
        status,
        RefreshTokens,
        HandleAPIRequest,
        isAuthenticated,
        username,
    };
}
