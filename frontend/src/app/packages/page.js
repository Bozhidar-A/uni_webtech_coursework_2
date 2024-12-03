'use client';

import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth"
import Package from "../components/Package";

export default function Packages() {
    const auth = useAuth();

    const [packages, setPackages] = useState([]);

    useEffect(() => {
        //even though I like async/await I dont wanna deal with 2-3 levels of promises
        auth.HandleAPIRequest(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_PACKAGES}`)
            .then((res) => res.json())
            .then((data) => {
                setPackages(data);
            }).catch((err) => {
                console.error(err);
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

    return (
        <div>
            <h1>Packages</h1>
            {packages.map((p) => {
                return <Package key={p.id}
                    id={p.id}
                    address={p.address}
                    deliveryPrice={p.deliveryPrice}
                    isDelivered={p.isDelivered}
                    recipientName={p.recipientName}
                    HandleUpdateState={HandleUpdateState} />
            })}
        </div>
    )
}