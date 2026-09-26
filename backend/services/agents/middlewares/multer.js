import multer from "multer";
import path from "path";
import fs from "fs";

// Upload directory
const uploadDir = path.resolve("./temp")

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}` +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

// Allow PDF + Image
const fileFilter = (req, file, cb) => {

    const allowedMimeTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and image files are allowed"), false);
    }
};

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize:5*1024*1024
    }
})

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10 MB
//     }
// });

// module.exports = upload;