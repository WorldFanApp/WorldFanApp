// app/client-providers.tsx
'use client';

import type React from 'react';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider'; // Adjust path if package structure is different
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'; // Alias to avoid name clash if you have another SessionProvider

interface ClientProvidersProps {
  children: React.ReactNode;
  // Session can be passed if needed for NextAuthSessionProvider, but often it's not explicitly passed
  // session?: any; // Or the correct NextAuth session type
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <MiniKitProvider>
      <NextAuthSessionProvider>
        {children}
      </NextAuthSessionProvider>
    </MiniKitProvider>
  );
}
