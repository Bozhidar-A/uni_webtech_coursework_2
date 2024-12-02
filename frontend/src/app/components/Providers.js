'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useState } from 'react';
import RefreshTokenHandler from '@/app/components/RefreshTokenHandler.js';
import { SubProviders } from './SubProviders';


export function Providers({ children }) {
    const [interval, setInterval] = useState(0);

    return (
        <SessionProvider refetchInterval={10}>
            <SubProviders>
                {children}
                {/* <RefreshTokenHandler setInterval={setInterval} /> */}
            </SubProviders>
        </SessionProvider>
    );
}