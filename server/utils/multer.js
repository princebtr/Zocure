const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with placeholder credentials
cloudinary.config({
  cloud_name: "djnerwn8s",
  api_key: "616774772831661",
  api_secret: "1RGJLzdZGGE3a9KhsnyUomeF294",
});

// Set up Cloudinary storage for doctor profiles
const doctorStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "doctor_profiles", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  },
});

// Set up Cloudinary storage for user profiles
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_profiles", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  },
});

const uploadDoctor = multer({ storage: doctorStorage });
const uploadUser = multer({ storage: userStorage });

module.exports = { uploadDoctor, uploadUser };
