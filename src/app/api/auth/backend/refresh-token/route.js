import RefreshToken from '@/app/models/RefreshToken';
import User from '@/app/models/User';
import dbConnect from '@/app/util/db';
import { CreateAccessToken, RefreshTokenValidation, StrToDate } from '@/app/util/tokens';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();

        const data = await req.json();

        console.log("SERVER - REFRESH TOKEN REQUEST: ", data);
        const { refreshToken } = data;

        //validate data
        var parsedData = RefreshTokenValidation.safeParse({ refreshToken });
        if (!parsedData.success) {
            console.log("SERVER - REFRESH TOKEN VALIDATION ERROR: ", parsedData.error.issues);
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        //verify token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        //token exists?
        const storedToken = await RefreshToken.findOne({
            token: refreshToken,
            user: decoded.id
        });

        if (!storedToken) {
            console.log("SERVER - refreshToken route: Token not found");
            return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
        }

        //token expired?
        if (storedToken.expiresAt < new Date()) {
            await RefreshToken.deleteOne({ _id: storedToken._id });
            console.log("SERVER - refreshToken route: Token expired");
            return NextResponse.json({ message: 'Refresh token expired' }, { status: 403 });
        }

        //find user
        const user = await User.findById(decoded.id);

        if (!user) {
            console.log("SERVER - refreshToken route: User not found");
            return NextResponse.json({ message: 'User not found' }, { status: 403 });
        }

        //gen new token
        const newAccessToken = CreateAccessToken(user);
        var dateToAccessExpires = StrToDate(process.env.ACCESS_TOKEN_EXPIRY);

        console.log("SERVER - REFRESH SUCCESS TOKEN: ", newAccessToken, dateToAccessExpires);
        return NextResponse.json({
            accessToken: newAccessToken,
            accessTokenExpiry: dateToAccessExpires.getTime(),
            username: user.username
        }, { status: 200 });
    } catch (error) {
        console.log("SERVER - INTERNAL SERVER ERROR ON REFRESH TOKEN: ", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}