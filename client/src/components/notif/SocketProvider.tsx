// components/SocketProvider.tsx
'use client'
import { useEffect } from 'react'
import { useOrderStore } from '@/store/useOrderStore'

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { initializeSocket, disconnectSocket } = useOrderStore()

  useEffect(() => {
    initializeSocket() // Connect socket saat komponen mount
    
    return () => {
      disconnectSocket() // Cleanup saat komponen unmount
    }
  }, [])

  return <>{children}</>
}