export const API_BASE_URL = "http://localhost:3002" // ✅ Ubah dari 3001 ke 3002

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
  CART: `${API_BASE_URL}/api/cart`,
  ADDRESS: `${API_BASE_URL}/api/address`,
  ORDER: `${API_BASE_URL}/api/order`,
  CHAT: `${API_BASE_URL}/api/chat`,
  WEBSOCKET: `ws://localhost:3002`, // ✅ Ubah dari 3001 ke 3002
}
