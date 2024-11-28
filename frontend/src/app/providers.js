'use client';

import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import RefreshTokenHandler from '@/app/components/RefreshTokenHandler.js';

export function Providers({ children }) {
    const [interval, setInterval] = useState(0);

    return (
        <SessionProvider refetchInterval={interval}>
            {children}
            <RefreshTokenHandler setInterval={setInterval} />
        </SessionProvider>
    );
}