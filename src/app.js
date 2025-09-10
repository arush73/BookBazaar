import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"
import { rateLimit } from "express-rate-limit"
import cors from "cors"
import morganMiddleware from "./logger/morgan.logger.js"
import session from "express-session"
import passport from "./passport/index.js"

const app = express()
console.log(process.env.EXPRESS_SESSION_SECRET)

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*" 
        : process.env.CORS_ORIGIN?.split(","), 
    credentials: true,
  })
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return req.clientIp
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    )
  },
})
app.use(limiter)
app.use(morganMiddleware)
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())

import healthcheckRouter from "./routes/healthCheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import bookRouter from "./routes/books.routes.js"
import orderRouter from "./routes/orders.routes.js"
import addressRouter from "./routes/address.routes.js"
import cartRouter from "./routes/cart.routes.js"

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1", bookRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/address", addressRouter)
app.use("/api/v1/cart", cartRouter)

export default app
