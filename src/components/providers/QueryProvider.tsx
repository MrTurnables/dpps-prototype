'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                refetchOnWindowFocus: false,
                queryFn: async ({ queryKey }) => {
                    const res = await fetch(queryKey[0] as string, {
                        credentials: 'include',
                    });

                    if (!res.ok) {
                        if (res.status >= 500) {
                            throw new Error(`${res.status}: ${res.statusText}`);
                        }
                        throw new Error(`${res.status}: ${await res.text()}`);
                    }

                    return res.json();
                },
            },
            mutations: {
                retry: false,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === 'undefined') {
        return makeQueryClient();
    } else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
