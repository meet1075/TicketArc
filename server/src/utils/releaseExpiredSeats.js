import cron from "node-cron";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../db/index.js"; // Use the correct path based on your setup
import { SeatAvailability } from "../models/seatAvailability.model.js"; // Fixed path

dotenv.config();

// Ensure DB connection before scheduling cron job
const initializeJob = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        console.log("✅ Cron job started: Releasing expired seats every minute.");

        cron.schedule("* * * * *", async () => {  // Runs every minute
            try {
                const result = await SeatAvailability.updateMany(
                    {
                        isReserved: true,
                        reservationExpiry: { $lt: new Date() }
                    },
                    {
                        $set: { isReserved: false, reservedBy: null, isAvailable: true, reservationExpiry: null }
                    }
                );

                if (result.modifiedCount > 0) {
                    console.log(`🔓 Released ${result.modifiedCount} expired seat reservations`);
                }
            } catch (error) {
                console.error("❌ Error releasing expired seats:", error);
            }
        });
    } catch (error) {
        console.error("❌ Failed to start cron job:", error);
    }
};

initializeJob();
