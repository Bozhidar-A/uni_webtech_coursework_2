import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const states = {
    AUTH_SIGNIN_SERVER_ERROR: "AUTH_SIGNIN_SERVER_ERROR",
    AUTH_SIGNIN_ERROR: "AUTH_SIGNIN_ERROR",
}

const OPTIONS = {
    providers: [
        CredentialsProvider({
            name: "Username and Password",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                //attempt to sing in
                try {
                    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_AUTH_LOGIN}`, {
                        method: "POST",
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/json" },
                    });

                    const data = await loginRes.json();

                    if (loginRes.ok && data.accessToken && data.refreshToken && data.accessTokenExpiry) {
                        return {
                            username: credentials.username,
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                            accessTokenExpiry: data.accessTokenExpiry,
                        };
                    }

                    return {
                        error: states.AUTH_SIGNIN_ERROR,
                    }
                } catch (error) {
                    console.error('Error in authorize:', error.message);
                    return {
                        error: states.AUTH_SIGNIN_SERVER_ERROR,
                    };
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, credentials }) {
            //check for errors
            //use credentials to check for data and edge cases
            if (user.error === states.AUTH_SIGNIN_SERVER_ERROR) {
                throw new Error("Server error occurred during sign in");
            }

            if (user.error === states.AUTH_SIGNIN_ERROR) {
                throw new Error("Invalid username or password");
            }

            return true;
        },
        async jwt({ token, user, account }) {
            //set up jwt token

            //initial sign in
            // i kinda understand why account is not null on init
            //but why?
            //export a boolean?
            //https://next-auth.js.org/v3/tutorials/refresh-token-rotation
            if (user && account) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpiry = user.accessTokenExpiry;
                token.username = user.username;
            }

            const isTokenExpired = Date.now() > token.accessTokenExpiry;
            if (!isTokenExpired) {
                return token;
            }

            //refresh token
            var refreshRes = await refreshAccessToken(token.refreshToken);

            console.log("jwt: ", refreshRes);

            if (refreshRes.accessToken) {
                return {
                    ...token,
                    accessToken: refreshRes.accessToken,
                    refreshToken: refreshRes.refreshToken,
                    accessTokenExpiry: refreshRes.accessTokenExpiry,
                };
            }

            //refresh token failed
            console.log('Error in jwt refresh (refresh token expired?):', refreshRes.error);

            return {
                error: "REFRESH_TOKEN_EXPIRED_ERROR",
            }
        },
        async session({ session, token, user }) {
            //use jwt to set up session
            if (token) {
                session.user = { username: token.username };
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
                session.accessTokenExpiry = token.accessTokenExpiry;
                session.error = token.error;
            }

            return session;
        },
    }
};

async function refreshAccessToken(refreshToken) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.API_AUTH_REFRESHTOKEN}`, {
            method: "POST",
            body: JSON.stringify({ refreshToken: refreshToken }),
            headers: { "Content-Type": "application/json" },
        });

        console.log("refreshAccessToken: ", response.ok);

        const data = await response.json();
        console.log("refreshAccessToken: ", data);
        if (response.ok && data.accessToken && data.refreshToken) {
            return {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                accessTokenExpiry: data.accessTokenExpiry,
            };
        }

        throw new Error("Failed to refresh access token");
    } catch (error) {
        console.error('Error in refreshAccessToken:', error.message);
        return { error: `Failed to refresh access token - ${error.message}` };
    }
}

const Auth = async (req, res) => {
    try {
        return await NextAuth(req, res, OPTIONS);
    } catch (error) {
        console.error('Error in Auth handler:', error.message);
        return new Response('Internal Server Error', { status: 500 });
    }
};


export { Auth as GET, Auth as POST };