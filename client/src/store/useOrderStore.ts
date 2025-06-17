// import { API_ROUTES } from "@/utils/api";
// import axios from "axios";
// import { create } from "zustand";

// interface OrderItem {
//   id: string;
//   productId: string;
//   productName: string;
//   productCategory: string;
//   quantity: number;
//   size?: string;
//   color?: string;
//   price: number;
// }

// export interface Order {
//   id: string;
//   userId: string;
//   addressId: string;
//   items: OrderItem[];
//   couponId?: string;
//   total: number;
//   status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
//   paymentMethod: "CREDIT_CARD" | "TRANSFER";
//   paymentStatus: "PENDING" | "COMPLETED";
//   paymentId?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface AdminOrder extends Order {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//   };
// }

// interface CreateOrderData {
//   userId: string;
//   addressId: string;
//   items: Omit<OrderItem, "id">[];
//   couponId?: string;
//   total: number;
//   paymentMethod: "CREDIT_CARD" | "TRANSFER";
//   paymentStatus: "PENDING" | "COMPLETED";
//   paymentId?: string;
// }

// interface OrderStore {
//   currentOrder: Order | null;
//   isLoading: boolean;
//   isPaymentProcessing: boolean;
//   userOrders: Order[];
//   adminOrders: AdminOrder[];
//   error: string | null;
//   createFinalOrder: (orderData: CreateOrderData) => Promise<Order | null>;
//   getOrder: (orderId: string) => Promise<Order | null>;
//   updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<boolean>;
//   getAllOrders: () => Promise<Order[] | null>;
//   getOrdersByUserId: () => Promise<Order[] | null>;
//   setCurrentOrder: (order: Order | null) => void;
//   initiateMidtransPayment: (
//     email: string,
//     userId: string,
//     addressId: string,
//     items: Omit<OrderItem, "id">[],
//     total: number
//   ) => Promise<void>;
// }

// declare global {
//   interface Window {
//     snap: any;
//   }
// }

// export const useOrderStore = create<OrderStore>((set, get) => ({
//   currentOrder: null,
//   isLoading: true,
//   isPaymentProcessing: false,
//   error: null,
//   userOrders: [],
//   adminOrders: [],
  

//   createFinalOrder: async (orderData) => {
//     set({ isLoading: true, error: null, isPaymentProcessing: true });
//     try {
//       const response = await axios.post(
//         `${API_ROUTES.ORDER}/create-final-order`,
//         orderData,
//         { withCredentials: true }
//       );
//       set({
//         isLoading: false,
//         currentOrder: response.data,
//         isPaymentProcessing: false,
//       });
//       return response.data;
//     } catch (error) {
//       set({
//         error: "Failed to create final order",
//         isLoading: false,
//         isPaymentProcessing: false,
//       });
//       return null;
//     }
//   },

//   updateOrderStatus: async (orderId, status) => {
//     set({ isLoading: true, error: null });
//     try {
//       await axios.put(
//         `${API_ROUTES.ORDER}/${orderId}/status`,
//         { status },
//         { withCredentials: true }
//       );
//       set((state) => ({
//         currentOrder:
//           state.currentOrder && state.currentOrder.id === orderId
//             ? { ...state.currentOrder, status }
//             : state.currentOrder,
//         isLoading: false,
//         adminOrders: state.adminOrders.map((item) =>
//           item.id === orderId ? { ...item, status } : item
//         ),
//       }));
//       return true;
//     } catch (error) {
//       set({ error: "Failed to update order status", isLoading: false });
//       return false;
//     }
//   },

//   getAllOrders: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.get(
//         `${API_ROUTES.ORDER}/get-all-orders-for-admin`,
//         { withCredentials: true }
//       );
//       set({ isLoading: false, adminOrders: response.data });
//       return response.data;
//     } catch (error) {
//       set({ error: "Failed to fetch admin orders", isLoading: false });
//       return null;
//     }
//   },

//   getOrdersByUserId: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.get(
//         `${API_ROUTES.ORDER}/get-order-by-user-id`,
//         { withCredentials: true }
//       );
//       set({ isLoading: false, userOrders: response.data });
//       return response.data;
//     } catch (error) {
//       set({ error: "Failed to fetch user orders", isLoading: false });
//       return null;
//     }
//   },

//   getOrder: async (orderId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.get(
//         `${API_ROUTES.ORDER}/get-single-order/${orderId}`,
//         { withCredentials: true }
//       );
//       set({ isLoading: false, currentOrder: response.data });
//       return response.data;
//     } catch (error) {
//       set({ error: "Failed to fetch single order", isLoading: false });
//       return null;
//     }
//   },

//   setCurrentOrder: (order) => set({ currentOrder: order }),

//   initiateMidtransPayment: async (email, userId, addressId, items, total) => {
//     set({ isPaymentProcessing: true });
//     try {
//       const response = await axios.post(
//         `${API_ROUTES.ORDER}/create-midtrans-transaction`,
//         { email, total, items },
//         { withCredentials: true }
//       );

//       const { token } = response.data;

//       if (window.snap) {
//         window.snap.pay(token, {
//           onSuccess: async (result: any) => {
//             await get().createFinalOrder({
//               userId,
//               addressId,
//               items,
//               total,
//               paymentMethod: "CREDIT_CARD",
//               paymentStatus: "COMPLETED",
//               paymentId: result.transaction_id,
//             });

//             await get().getOrdersByUserId();
//           },
//           onPending: () => {
//             console.log("Pembayaran pending...");
//           },
//           onError: () => {
//             set({ error: "Pembayaran gagal" });
//           },
//           onClose: () => {
//             console.log("Popup Snap ditutup oleh user");
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Midtrans Snap error:", error);
//       set({ error: "Gagal memproses Midtrans" });
//     } finally {
//       set({ isPaymentProcessing: false });
//     }
//   },
// }));
import { io, Socket } from 'socket.io-client';
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentMethod: "CREDIT_CARD" | "TRANSFER";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder extends Order {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateOrderData {
  userId: string;
  addressId: string;
  items: Omit<OrderItem, "id">[];
  couponId?: string;
  total: number;
  paymentMethod: "CREDIT_CARD" | "TRANSFER";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
}

interface OrderStore {
  currentOrder: Order | null;
  isLoading: boolean;
  isPaymentProcessing: boolean;
  userOrders: Order[];
  adminOrders: AdminOrder[];
  error: string | null;
  socket: Socket | null;
  createFinalOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  getOrder: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<boolean>;
  getAllOrders: () => Promise<Order[] | null>;
  getOrdersByUserId: () => Promise<Order[] | null>;
  setCurrentOrder: (order: Order | null) => void;
  initiateMidtransPayment: (
    email: string,
    userId: string,
    addressId: string,
    items: Omit<OrderItem, "id">[],
    total: number
  ) => Promise<void>;
  initializeSocket: () => void;
  disconnectSocket: () => void;
}

declare global {
  interface Window {
    snap: any;
  }
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  currentOrder: null,
  isLoading: true,
  isPaymentProcessing: false,
  error: null,
  userOrders: [],
  adminOrders: [],
  socket: null,

  // ================= SOCKET HANDLERS ================= //
  initializeSocket: () => {
    if (get().socket) return;

    const socket = io(API_ROUTES.WEBSOCKET, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('order_status_updated', (data: { orderId: string; newStatus: Order["status"] }) => {
      const { orderId, newStatus } = data;
      set((state) => ({
        currentOrder: 
          state.currentOrder?.id === orderId 
            ? { ...state.currentOrder, status: newStatus } 
            : state.currentOrder,
        userOrders: state.userOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ),
      }));
      // Contoh notifikasi UI (bisa diganti dengan toast library)
      alert(`Order #${orderId} status updated to: ${newStatus}`);
    });

    socket.on('new_order_admin', (order: Order) => {
      // Hanya untuk admin (jika diperlukan)
      console.log('New order created:', order);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
  // =================================================== //

  createFinalOrder: async (orderData) => {
    set({ isLoading: true, error: null, isPaymentProcessing: true });
    try {
      const response = await axios.post(
        `${API_ROUTES.ORDER}/create-final-order`,
        orderData,
        { withCredentials: true }
      );
      
      set({
        isLoading: false,
        currentOrder: response.data,
        isPaymentProcessing: false,
      });
      
      return response.data;
    } catch (error) {
      set({
        error: "Failed to create final order",
        isLoading: false,
        isPaymentProcessing: false,
      });
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(
        `${API_ROUTES.ORDER}/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      
      set((state) => ({
        currentOrder:
          state.currentOrder && state.currentOrder.id === orderId
            ? { ...state.currentOrder, status }
            : state.currentOrder,
        isLoading: false,
        adminOrders: state.adminOrders.map((item) =>
          item.id === orderId ? { ...item, status } : item
        ),
      }));
      
      return true;
    } catch (error) {
      set({ error: "Failed to update order status", isLoading: false });
      return false;
    }
  },

  getAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-all-orders-for-admin`,
        { withCredentials: true }
      );
      set({ isLoading: false, adminOrders: response.data });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch admin orders", isLoading: false });
      return null;
    }
  },

  getOrdersByUserId: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-order-by-user-id`,
        { withCredentials: true }
      );
      set({ isLoading: false, userOrders: response.data });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch user orders", isLoading: false });
      return null;
    }
  },

  getOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-single-order/${orderId}`,
        { withCredentials: true }
      );
      set({ isLoading: false, currentOrder: response.data });
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch single order", isLoading: false });
      return null;
    }
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),

  initiateMidtransPayment: async (email, userId, addressId, items, total) => {
    set({ isPaymentProcessing: true });
    try {
      const response = await axios.post(
        `${API_ROUTES.ORDER}/create-midtrans-transaction`,
        { email, total, items },
        { withCredentials: true }
      );

      const { token } = response.data;

      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: async (result: any) => {
            await get().createFinalOrder({
              userId,
              addressId,
              items,
              total,
              paymentMethod: "CREDIT_CARD",
              paymentStatus: "COMPLETED",
              paymentId: result.transaction_id,
            });
            await get().getOrdersByUserId();
          },
          onPending: () => {
            console.log("Pembayaran pending...");
          },
          onError: () => {
            set({ error: "Pembayaran gagal" });
          },
          onClose: () => {
            console.log("Popup Snap ditutup oleh user");
          },
        });
      }
    } catch (error) {
      console.error("Midtrans Snap error:", error);
      set({ error: "Gagal memproses Midtrans" });
    } finally {
      set({ isPaymentProcessing: false });
    }
  },
}));