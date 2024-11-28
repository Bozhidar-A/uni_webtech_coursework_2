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

                if (user.accessToken) {
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
                // When logging in, set token details
                token.accessToken = user.accessToken;
                token.accessTokenExpiry = user.accessTokenExpiry;
                token.refreshToken = user.refreshToken;
                token.username = user.username;
            }
            return token; // Return updated token or the original one
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.accessTokenExpiry = token.accessTokenExpiry;
            session.error = token.error;
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
