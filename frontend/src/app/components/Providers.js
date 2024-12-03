'use client';

import { SessionProvider } from 'next-auth/react';
import { SubProviders } from './SubProviders';


export function Providers({ children }) {

    return (
        <SessionProvider refetchInterval={process.env.NEXT_PUBLIC_SESSION_POLL_INTERVAL}>
            <SubProviders>
                {children}
            </SubProviders>
        </SessionProvider>
    );
}