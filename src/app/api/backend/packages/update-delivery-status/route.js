import Package from '@/app/models/Package';
import dbConnect from '@/app/util/db';
import { PackageUpdateValidation } from '@/app/util/tokens';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();

        const data = await req.json();

        console.log("SERVER - UPDATE DELIVERY STATUS REQUEST: ", data);
        const { packageID, isDelivered } = data;

        //validate data
        const parsedData = PackageUpdateValidation.safeParse({ packageID, isDelivered });
        if (!parsedData.success) {
            console.log("SERVER - UPDATE DELIVERY STATUS VALIDATION ERROR: ", parsedData.error.issues);
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        //does package exist?
        const workedPackage = await Package.findOne({
            id: packageID
        });

        if (!workedPackage) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 });
        }

        //update package
        const requestStatus = await Package.updateOne(
            { id: packageID },
            { $set: { isDelivered } }
        );

        if (requestStatus.matchedCount === 0) {
            console.log("This was already checked? WHAT?!?!?");
            return NextResponse.json({ error: "Package not found" }, { status: 404 });
        }

        if (requestStatus.nModified === 0) {
            return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
        }

        return NextResponse.json({ message: "Package updated" }, { status: 200 });
    } catch (error) {
        console.log("SERVER - INTERNAL SERVER ERROR ON UPDATE DELIVERY STATUS: ", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}