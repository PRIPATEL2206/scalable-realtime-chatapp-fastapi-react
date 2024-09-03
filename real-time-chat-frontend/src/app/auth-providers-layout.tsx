'use client'
import { AuthProvider } from '@/hooks/auth-provider'
import React, { useEffect } from 'react'
import RoutingLayout from './routing-layout'
import { TostProvider } from '@/hooks/tost-provider'

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider >
            <TostProvider>
                <RoutingLayout>
                    {children}
                </RoutingLayout>
            </TostProvider>
        </AuthProvider>

    )
}
