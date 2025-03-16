import cron from "node-cron";
import dotenv from "dotenv";
import connectDB from "../db/index.js"; // Ensure correct path to index.js
import { SeatAvailability } from "../models/seatAvailability.model.js";
import { ShowTime } from "../models/showtime.model.js"; 

dotenv.config();

const initializeJob = async () => {
    try {
        await connectDB(); // Connect to MongoDB

        cron.schedule("* * * * *", async () => {  
            try {
                // Release expired seat reservations
                const seatResult = await SeatAvailability.updateMany(
                    {
                        isReserved: true,
                        reservationExpiry: { $lt: new Date() }
                    },
                    {
                        $set: { isReserved: false, reservedBy: null, isAvailable: true, reservationExpiry: null }
                    }
                );

                if (seatResult.modifiedCount > 0) {
                    console.log(`🔓 Released ${seatResult.modifiedCount} expired seat reservations`);
                }

                // Update expired showtimes to "Completed"
                const now = new Date();
                const showtimeResult = await ShowTime.updateMany(
                    { showDateTime: { $lt: now }, status: { $ne: "Completed" } },
                    { $set: { status: "Completed" } }
                );

                if (showtimeResult.modifiedCount > 0) {
                    console.log(`🎬 Updated ${showtimeResult.modifiedCount} expired showtimes to 'Completed'`);
                }

            } catch (error) {
                console.error("❌ Error in cron job:", error);
            }
        });

    } catch (error) {
        console.error("❌ Failed to start cron job:", error);
    }
};

initializeJob();
