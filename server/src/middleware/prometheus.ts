import promClient from "prom-client"
import type { Request, Response, NextFunction } from "express"

// Create a Registry to register the metrics
const register = new promClient.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "ecommerce-api",
})

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register })

// Create custom metrics
export const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
})

export const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
})

export const activeConnections = new promClient.Gauge({
  name: "active_connections",
  help: "Number of active connections",
})

export const databaseQueries = new promClient.Counter({
  name: "database_queries_total",
  help: "Total number of database queries",
  labelNames: ["operation", "table"],
})

export const authAttempts = new promClient.Counter({
  name: "auth_attempts_total",
  help: "Total number of authentication attempts",
  labelNames: ["type", "status"],
})

export const orderMetrics = new promClient.Counter({
  name: "orders_total",
  help: "Total number of orders",
  labelNames: ["status"],
})

export const cartOperations = new promClient.Counter({
  name: "cart_operations_total",
  help: "Total number of cart operations",
  labelNames: ["operation"],
})

export const chatMessages = new promClient.Counter({
  name: "chat_messages_total",
  help: "Total number of chat messages",
  labelNames: ["sender_type"],
})

// Register all metrics
register.registerMetric(httpRequestDuration)
register.registerMetric(httpRequestsTotal)
register.registerMetric(activeConnections)
register.registerMetric(databaseQueries)
register.registerMetric(authAttempts)
register.registerMetric(orderMetrics)
register.registerMetric(cartOperations)
register.registerMetric(chatMessages)

// Middleware to collect HTTP metrics
export const prometheusMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000
    const route = req.route?.path || req.path

    httpRequestDuration.labels(req.method, route, res.statusCode.toString()).observe(duration)

    httpRequestsTotal.labels(req.method, route, res.statusCode.toString()).inc()
  })

  next()
}

// Export the register for the metrics endpoint
export { register }
