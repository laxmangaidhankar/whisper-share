import multer from "multer";
import { env } from "../config/env.js";

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: env.MAX_UPLOAD_SIZE,
        files: 1
    }
});

export function encryptedFileUpload(req, res, next) {
    upload.single("encryptedFile")(req, res, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError) {
            const message = error.code === "LIMIT_FILE_SIZE"
                ? `Encrypted file exceeds the ${env.MAX_UPLOAD_SIZE} byte limit`
                : error.message;
            return res.status(400).json({ success: false, message });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid multipart upload"
        });
    });
}