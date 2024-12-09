import jwt from 'jsonwebtoken'
import * as jose from 'jose'
import RefreshToken from "../models/RefreshToken";
import { z } from "zod";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const jwtConfig = {
    secret: new TextEncoder().encode(process.env.JWT_SECRET),
}


export function StrToDate(str) {
    var parts = str.split("");
    console.log("STR TO DATE: ", parts);
    //check for above 3 digits like 150m
    if (parts.length > 3) throw new Error("Invalid date format");

    var restOfParts = parts.slice(0, parts.length - 1);
    var parsed = parseInt(restOfParts.join(''));

    switch (parts[parts.length - 1]) {
        case "s":
            return new Date(Date.now() + parsed * 1000);
        case "m":
            return new Date(Date.now() + parsed * 60000);
        case "h":
            return new Date(Date.now() + parsed * 3600000);
        case "d":
            return new Date(Date.now() + parsed * 86400000);
        default:
            throw new Error("Invalid date format");
    }
}

export function CreateAccessToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
}

export async function CreateRefreshToken(user) {
    // Remove existing refresh tokens for this user
    await RefreshToken.deleteMany({ user: user.id });

    const refreshToken = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    await RefreshToken.create({
        user: user.id,
        token: refreshToken,
        expiresAt: StrToDate(process.env.REFRESH_TOKEN_EXPIRY),
    });

    return refreshToken;
}

export async function AuthenticateToken(req, res, next) {
    const headerList = await headers();
    const authHeader = headerList.get("authorization");
    console.log("AUTH HEADER: ", authHeader);
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    //debug
    console.log("TOKEN: ", token);

    if (token == null) return false

    try {
        const decoded = await jose.jwtVerify(token, jwtConfig.secret)

        console.log("DECODED: ", decoded);

        if (!decoded.payload?.id) {
            return false
        }
    } catch (error) {
        console.log("JWT VERIFY ERROR: ", error);
        return false
    }

    return true
}

export const UserLoginValidation = z.object({
    username: z.string().min(1).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(1),
})

export const RefreshTokenValidation = z.object({
    refreshToken: z.string().min(1),
})

export const PackageUpdateValidation = z.object({
    packageID: z.string().uuid(),
    isDelivered: z.boolean(),
})
