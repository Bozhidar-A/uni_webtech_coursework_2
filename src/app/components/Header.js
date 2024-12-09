import Link from "next/link";
import useAuth from "../hooks/useAuth";
import { signIn, signOut } from "next-auth/react";

export default function Header() {
    const auth = useAuth();

    return (
        <header className="sticky top-0 z-50 overflow-hidden border-b-2 border-white h-14">
            <nav className="bg-white px-4 lg:px-6 py-2.5 dark:bg-neutral-950 ">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl overflow-x-hidden">
                    <Link href={process.env.NEXT_PUBLIC_NAVIGATION_HOME_PAGE} className="flex items-center">
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
                                    href={process.env.NEXT_PUBLIC_NAVIGATION_PACKAGES_PAGE}
                                    className="block py-2 px-3 text-white bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                >
                                    <p>Packages</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}