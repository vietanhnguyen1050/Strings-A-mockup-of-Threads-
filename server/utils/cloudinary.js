import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Upload local file path to Cloudinary, returns secure_url
 * @param {string} path local file path
 */
export const uploadToCloudinary = (path) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, { folder: "strings" }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
  });
};
