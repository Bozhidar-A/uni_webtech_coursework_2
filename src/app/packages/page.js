'use client';

import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth"
import Package from "../components/Package";
import LoadingWait from "../components/LoadingWait";

export default function Packages() {
    const auth = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        //even though I like async/await I dont wanna deal with 2-3 levels of promises
        auth.HandleAPIRequest(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_PACKAGES}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setPackages(data);
                setLoading(false);
            }).catch((err) => {
                console.error(err);
                setError(err);
                setLoading(false);
                alert("Error fetching packages");
            });

    }, []);

    function HandleUpdateState(id, isDelivered) {
        auth.HandleAPIRequest(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_PACKAGES_UPDATE_DELIVERY_STATUS}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ packageID: id, isDelivered: isDelivered }),
        }).then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    setPackages(packages.map((p) => {
                        if (p.id === id) {
                            p.isDelivered = isDelivered;
                        }
                        return p;
                    }));
                }
            }).catch((err) => {
                console.error(err);
                alert("Error updating package state");
            }
            );
    }

    if (loading) {
        return <LoadingWait />
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Packages</h1>

            {error ? (<div className="text-center text-red-500 py-12">
                Error fetching packages
            </div>
            ) : packages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No packages found
                </div>
            ) : (
                <div className="space-y-4">
                    {packages.map((p) => (
                        <Package
                            key={p.id}
                            id={p.id}
                            address={p.address}
                            deliveryPrice={p.deliveryPrice}
                            isDelivered={p.isDelivered}
                            recipientName={p.recipientName}
                            HandleUpdateState={HandleUpdateState}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}