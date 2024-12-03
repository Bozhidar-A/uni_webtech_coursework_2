import Link from "next/link";
import useAuth from "../hooks/useAuth";
import { signIn, signOut } from "next-auth/react";

export default function Header() {
    const auth = useAuth();

    function AccountLoginSwitcher() {
        if (auth.isAuthenticated) {
            return (
                <>
                    <p className="text-gray-800 dark:text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2">Welcome, {auth.username}</p>
                    <button onClick={signOut} className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 rounded-lg lg:px-5 py-2 lg:py-2.5 mr-2">Logout</button>
                </>
            )
        }

        return (
            <button onClick={signIn} className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Login</button>
        )
    }

    return (
        <header className="sticky top-0 z-50 overflow-hidden">
            <nav className="bg-white px-4 lg:px-6 py-2.5 dark:bg-neutral-950 border-b-2 border-white">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl overflow-x-hidden">
                    <Link href={process.env.NEXT_PUBLIC_HOME_PAGE} className="flex items-center">
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                            Home
                        </span>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        <p className="text-gray-800 dark:text-white font-medium text-sm px-4">
                            Welcome, {auth?.username || "Guest"}
                        </p>
                        <button
                            onClick={auth?.isAuthenticated ? signOut : signIn}
                            className="text-white bg-primary-700 hover:bg-primary-800 rounded-lg text-sm px-4 py-2"
                        >
                            {auth?.isAuthenticated ? "Logout" : "Login"}
                        </button>
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-0 font-medium lg:flex-row lg:space-x-8">
                            <li>
                                <Link
                                    href={process.env.NEXT_PUBLIC_API_PACKAGES}
                                    className="block py-2 px-3 text-white bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                >
                                    Packages
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}