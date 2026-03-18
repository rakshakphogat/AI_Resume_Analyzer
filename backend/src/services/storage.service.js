import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env.js";

if (env.USE_CLOUDINARY) {
    cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
    });
}

export const uploadFileIfNeeded = async (localPath) => {
    if (!env.USE_CLOUDINARY) {
        return { url: localPath, storage: "local" };
    }

    const response = await cloudinary.uploader.upload(localPath, {
        folder: "ai-resume-analyzer",
        resource_type: "raw",
    });

    return { url: response.secure_url, storage: "cloudinary" };
};
