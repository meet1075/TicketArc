import cron from "node-cron";
import dotenv from "dotenv";
import connectDB from "../db/index.js"; // Ensure correct path to index.js
import { SeatAvailability } from "../models/seatAvailability.model.js"; 

dotenv.config();

const initializeJob = async () => {
    try {
        await connectDB(); // Connect to MongoDB

        cron.schedule("* * * * *", async () => {  
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

initializeJob()
