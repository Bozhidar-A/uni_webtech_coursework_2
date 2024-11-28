import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

// Authentication providers
const providers = [
    CredentialsProvider({
        name: 'Credentials',
        authorize: async (credentials) => {
            try {
                const response = await axios.post(
                    `${process.env.API_BASE_URL}${process.env.API_AUTH_LOGIN}`,
                    {
                        username: credentials.username,
                        password: credentials.password,
                    }
                );

                const user = response.data;
                console.log('User:', user);

                if (user.accessToken) {
                    console.log("user is returned");
                    return user; // Return user data if authentication is successful
                }

                // If login fails, return null so client-side can handle the error
                return null;
            } catch (error) {
                console.error('Error in authorize:', error.message);
                // Ensure that you throw a specific error for the client-side
                throw new Error('Authentication failed. Please check your credentials and try again.');
            }
        },
    }),
];

// Authentication options
export const OPTIONS = {
    providers,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.accessTokenExpiry = user.accessTokenExpiry;
                token.refreshToken = user.refreshToken;
                token.username = user.username;
            } else if (token.accessTokenExpiry && token.refreshToken) {
                // Check if the access token is expired
                const isTokenExpired = Date.now() > token.accessTokenExpiry;

                if (isTokenExpired) {
                    try {
                        // Call the API to refresh the token
                        const response = await axios.post(`${process.env.API_BASE_URL}${process.env.API_AUTH_REFRESHTOKEN}`, {
                            refreshToken: token.refreshToken,
                        });

                        // Update the token with the new access token and expiry
                        token.accessToken = response.data.accessToken;
                        token.accessTokenExpiry = response.data.accessTokenExpiry;
                        token.refreshToken = response.data.refreshToken || token.refreshToken; // optional if a new refresh token is returned
                    } catch (error) {
                        console.error('Failed to refresh token:', error.message);

                        // If refresh fails (e.g., invalid refresh token), log out the user
                        return null; // This will clear the session
                    }
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (!token) {
                // If no token, the user has been logged out
                session.user = null;
            } else {
                session.accessToken = token.accessToken;
                session.accessTokenExpiry = token.accessTokenExpiry;
                session.error = token.error;
            }
            return session;
        },
    },
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        error: '/auth/error', // This will handle the error page
    },
};

// Main handler for NextAuth
const Auth = async (req, res) => {
    try {
        return await NextAuth(req, res, OPTIONS);
    } catch (error) {
        console.error('Error in Auth handler:', error.message);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export { Auth as GET, Auth as POST };
