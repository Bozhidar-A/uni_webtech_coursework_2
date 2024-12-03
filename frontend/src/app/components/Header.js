import Link from "next/link";
import useAuth from "../hooks/useAuth";
import { signIn, signOut } from "next-auth/react";

export default function Header() {
    const auth = useAuth();

    function AccountLoginSwitcher() {
        if (auth.isAuthenticated) {
            return (
                <>
                    <p href="#" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Welcome, {auth.username}</p>
                    <button onClick={signOut} className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Logout</button>
                </>
            )
        }

        return (
            <button onClick={signIn} className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Login</button>
        )
    }

    return (
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link href="/" className="flex items-center">
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 rounded-lg lg:px-5 py-2 lg:py-2.5 mr-2">Home</span>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        <AccountLoginSwitcher />
                    </div>
                    <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                        <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <Link href="/packages" class="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">Packages</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}