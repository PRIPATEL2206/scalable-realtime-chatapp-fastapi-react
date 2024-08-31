'use client'
import { AuthProvider } from '@/hooks/auth-provider'
import React, { useEffect } from 'react'
import RoutingLayout from './routing-layout'

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider >
            <RoutingLayout>
                {children}
            </RoutingLayout>
        </AuthProvider>
    )
}
