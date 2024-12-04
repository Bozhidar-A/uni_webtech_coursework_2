import Package from "@/app/models/Package";
import dbConnect from "@/app/util/db";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const sesh = getSession({ req });

        await dbConnect();
        console.log("SERVER - PACKAGES REQUESTED");
        const packages = await Package.find();

        return NextResponse.json(packages, { status: 200 });
    } catch (error) {
        console.log("SERVER - INTERNAL SERVER ERROR ON PACKAGES TOKEN: ", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}