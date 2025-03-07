import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import movieRouter from './routes/movie.routes.js'
import threaterRouter from './routes/theater.routes.js'
import screenRouter from './routes/screen.routes.js'
import showtimeRouter from './routes/showtime.routes.js'
import seatRouter from './routes/seat.routes.js'
import bookingRouter from './routes/booking.routes.js'
import paymentRouter from './routes/payment.routes.js'
app.use("/api/v1/user",userRouter)
app.use("/api/v1/movie",movieRouter)
app.use("/api/v1/theater",threaterRouter)
app.use("/api/v1/screen",screenRouter)
app.use("/api/v1/showtime",showtimeRouter)
app.use("/api/v1/seat",seatRouter)
app.use("/api/v1/booking",bookingRouter)
app.use("/api/v1/payment",paymentRouter)

export { app }