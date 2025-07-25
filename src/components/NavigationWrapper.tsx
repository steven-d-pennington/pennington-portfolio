'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function NavigationWrapper() {
  const pathname = usePathname()
  
  // Don't render navigation on client routes (they have their own nav or none)
  if (pathname.startsWith('/client/')) {
    return null
  }
  
  return <Navigation />
}