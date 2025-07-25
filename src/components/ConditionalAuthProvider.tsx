'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/components/AuthProvider'

export function ConditionalAuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't apply AuthProvider to client routes
  // Client routes have their own ClientAuthProvider
  const isClientRoute = pathname.startsWith('/client/')
  
  if (isClientRoute) {
    return <>{children}</>
  }
  
  return <AuthProvider>{children}</AuthProvider>
}