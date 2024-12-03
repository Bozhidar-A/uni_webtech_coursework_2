'use client';

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function Login() {
    const router = useRouter();

    async function HandleSubmit(e) {
        e.preventDefault();

        const res = await signIn('credentials', {
            username: e.target.username.value,
            password: e.target.password.value,
            redirect: false
        });

        console.log('Login response:', res);

        if (res?.error) {
            // Display an alert or a custom notification to the user
            alert(`Error: ${res.error}`);  // Simple alert for demonstration
        } else {
            // Handle successful login (e.g., redirect user or update UI)
            // alert('Login successful!');
            router.push('/');  // Redirect to the homepage
        }

    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={HandleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}