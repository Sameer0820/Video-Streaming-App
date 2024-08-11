import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successsfully
        // console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        // Delete the asset with the given public ID
        const response = await cloudinary.uploader.destroy(publicId, {resource_type: resourceType});
        return response;
    } catch (error) {
        console.error("Error deleting asset from Cloudinary:", error.message);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
