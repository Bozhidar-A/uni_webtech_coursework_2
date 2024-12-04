import User from "@/app/models/User";
import dbConnect from "@/app/util/db";
import bcrypt from "bcrypt";
import { CreateAccessToken, CreateRefreshToken, StrToDate, UserLoginValidation } from "@/app/util/tokens";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

        console.log("SERVER - LOGIN REQUEST: ", req);
        const data = await req.json();

        console.log("SERVER - LOGIN REQUEST: ", data);
        const { username, password } = data;

        const parsedLogin = UserLoginValidation.safeParse({ username, password });
        if (!parsedLogin.success) {
            console.log("SERVER - LOGIN VALIDATION ERROR: ", parsedLogin.error.issues);
            return NextResponse.json({ message: "Invalid username or password" }, { status: 400 });
        }

        const user = await User.findOne({
            username: username
        });

        console.log("SERVER - LOGIN USER: ", user);
        if (!user) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 400 });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        console.log("SERVER - LOGIN VALID PASSWORD: ", validPassword);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 400 });
        }

        const accessToken = CreateAccessToken(user);
        const refreshToken = await CreateRefreshToken(user);
        const accessTokenExpiry = StrToDate(process.env.ACCESS_TOKEN_EXPIRY).getTime();

        return NextResponse.json({ accessToken, refreshToken, accessTokenExpiry, username }, { status: 200 });
    } catch (err) {
        console.error("SERVER - INTERNAL SERVER ERROR ON LOGIN REQUEST: ", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}