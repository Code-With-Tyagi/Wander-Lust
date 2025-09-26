import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// cloud credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

})

// making a storage
export const storage = new CloudinaryStorage({
    cloudinary, // to pass the cloudinary configuration
    params: {
        folder: 'wanderlust_dev',
        allowedFormat: ["png", "jpeg", "jpg"],
    },
});

export default { cloudinary};