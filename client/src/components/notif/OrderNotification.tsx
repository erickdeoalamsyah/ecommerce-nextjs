// components/OrderNotification.tsx
'use client'
import { useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"; 
import { Order, useOrderStore } from '@/store/useOrderStore'

export const OrderNotification = () => {
  const { socket } = useOrderStore()
  const { toast } = useToast() // Mengambil toast dari useToast()

  useEffect(() => {
    if (!socket) return

    // Listen event update status order
    socket.on('order_status_updated', (data: {
      orderId: string
      newStatus: string
    }) => {
      toast({
        title: `Order #${data.orderId}`,
        description: `Status updated to: ${data.newStatus}`,
      })
    })

    // Listen event order baru (untuk admin)
    socket.on('new_order', (order: Order) => {
      toast({
        title: `New order from user ${order.userId}`,
        description: `Order #${order.id} has been created.`,
      })
    })

    return () => {
      socket.off('order_status_updated')
      socket.off('new_order')
    }
  }, [socket, toast])

  return null // Komponen tidak render UI
}
