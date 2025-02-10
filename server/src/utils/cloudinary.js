import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Use fs/promises for async operations

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localpath) => {
    try {
        if (!localpath) return null;

        // Ensure the file exists before proceeding
        try {
            await fs.access(localpath);
        } catch (error) {
            console.error("File does not exist:", localpath);
            return null;
        }

        // Add delay to prevent file lock issues
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Upload to Cloudinary with proper settings
        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: "image",
            timeout: 600000, // Prevent timeout errors
            chunk_size: 6000000, // Upload in chunks
        });

        console.log("Cloudinary Upload Success:", response.secure_url);

        // Ensure some delay before deleting to avoid conflicts
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Delete the file after successful upload
        try {
            await fs.unlink(localpath);
            console.log("File deleted successfully:", localpath);
        } catch (err) {
            console.error("Error deleting file:", err);
        }

        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);

        // Attempt to delete the file if it still exists
        try {
            await fs.access(localpath); // Check if file exists
            await fs.unlink(localpath);
            console.log("File deleted after upload failure:", localpath);
        } catch (err) {
            console.error("Error deleting file after failure:", err);
        }

        return null;
    }
};

export { uploadOnCloudinary };
