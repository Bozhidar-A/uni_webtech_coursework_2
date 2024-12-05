// import { NextResponse } from "next/server";
// import { AuthenticateToken } from "./app/util/tokens";
// import { getSession } from "next-auth/react";
// import { getServerSession } from "next-auth";
// import { OPTIONS } from "./app/api/auth/[...nextauth]/route";

// // export const config = { matcher: ["/packages(.*)"] }

// export async function middleware(req) {
//     const sesh = await getServerSession(OPTIONS);

//     console.log("sesh: ", sesh);

//     const protectedRoutes = [process.env.NEXT_PUBLIC_API_PACKAGES,
//     process.env.NEXT_PUBLIC_API_PACKAGES_UPDATE_DELIVERY_STATUS,
//     process.env.NEXT_PUBLIC_NAVIGATION_PACKAGES_PAGE];

//     const path = req.nextUrl.pathname;
//     const isProtectedRoute = protectedRoutes.some((e) => path.includes(e));

//     // console.log(req)

//     const isTokenOK = await AuthenticateToken(req);

//     console.log("isTokenOK: ", isTokenOK);
//     console.log("isProtectedRoute: ", isProtectedRoute);

//     if (!isTokenOK && isProtectedRoute) {

//         return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_NAVIGATION_LOGIN_PAGE}`);
//     }

//     return NextResponse.next();
// }

export { default } from "next-auth/middleware"

// const protectedRoutes = [process.env.NEXT_PUBLIC_API_PACKAGES,
// process.env.NEXT_PUBLIC_API_PACKAGES_UPDATE_DELIVERY_STATUS,
// process.env.NEXT_PUBLIC_NAVIGATION_PACKAGES_PAGE];

export const config = { matcher: ["/packages", "/api/backend/packages/update-delivery-status", "/api/backend/packages"] }