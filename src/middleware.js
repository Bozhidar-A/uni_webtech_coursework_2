// export { default } from "next-auth/middleware"

import { NextResponse } from "next/server";
import { AuthenticateToken } from "./app/util/tokens";

// export const config = { matcher: ["/packages(.*)"] }

export function middleware(request) {
    // console.log("REQUEST: ", request);
    return AuthenticateToken(request);
}

export const config = {
    matcher: ['/api/backend/packages(.*)'],
}