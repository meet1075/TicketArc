import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiErrors } from "./utils/ApiErrors.js"; // Make sure you import this

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
import movieRouter from './routes/movie.routes.js';
import threaterRouter from './routes/theater.routes.js';
import screenRouter from './routes/screen.routes.js';
import showtimeRouter from './routes/showtime.routes.js';
import seatRouter from './routes/seat.routes.js';
import seatAvailabilityRouter from './routes/seatAvailability.routes.js';
import bookingRouter from './routes/booking.routes.js';
import paymentRouter from './routes/payment.routes.js';

app.use("/api/v1/user", userRouter);
app.use("/api/v1/movie", movieRouter);
app.use("/api/v1/theater", threaterRouter);
app.use("/api/v1/screen", screenRouter);
app.use("/api/v1/showtime", showtimeRouter);
app.use("/api/v1/seat", seatRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/seatAvailability", seatAvailabilityRouter);

// Global Error Handler ✅
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export { app };
