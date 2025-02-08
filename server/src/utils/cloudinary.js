import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"; // For file extension detection

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary = async (localFilePath) => {
    console.log(localFilePath);
    try {
        if (!localFilePath) return null;

        //upload to cloudinary if localFilePath exists
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        // console.log("file uploaded to cloudinary", result.url);

        fs.unlinkSync(localFilePath); //remove file from localFilePath after uploading to cloudinary
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return error;
    }
};