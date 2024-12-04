import Package from "@/app/models/Package";
import dbConnect from "@/app/util/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        console.log("SERVER - PACKAGES REQUESTED");
        const packages = await Package.find({});
        console.log("SERVER - PACKAGES: ", packages);

        return NextResponse.json(packages, { status: 200 });
    } catch (error) {
        console.log("SERVER - INTERNAL SERVER ERROR ON PACKAGES TOKEN: ", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}