import type { Socket } from "socket.io"
import { jwtVerify } from "jose"
import type { ExtendedError } from "socket.io/dist/namespace"

export interface AuthenticatedSocket extends Socket {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export const authenticateSocket = async (
  socket: AuthenticatedSocket,
  next: (err?: ExtendedError | undefined) => void,
): Promise<void> => {
  try {
    // Get cookies from handshake
    const cookies = socket.handshake.headers.cookie
    if (!cookies) {
      next(new Error("Authentication error: No cookies provided"))
      return
    }

    // Parse cookies
    const cookieObj: Record<string, string> = {}
    cookies.split(";").forEach((cookie) => {
      const parts = cookie.split("=")
      const key = parts[0].trim()
      const value = parts[1]?.trim()
      if (key && value) cookieObj[key] = value
    })

    const accessToken = cookieObj["accessToken"]
    if (!accessToken) {
      next(new Error("Authentication error: No access token"))
      return
    }

    // Verify JWT
    const { payload } = await jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_SECRET))

    // Set user data on socket
    socket.user = {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    }

    next()
  } catch (error) {
    console.error("Socket authentication error:", error)
    next(new Error("Authentication error"))
  }
}

export const getUserOnlineStatus = async (userId: string): Promise<boolean> => {
  // This would be implemented with a Redis store in production
  // For now, we'll just return true if we have the user in our sockets
  return true
}
