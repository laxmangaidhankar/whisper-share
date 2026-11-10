import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_PRODUCTION: process.env.DATABASE_URL_PRODUCTION,
    FRONTEND_URL: process.env.FRONTEND_URL,
    FRONTEND_URL_PRODUCTION: process.env.FRONTEND_URL_PRODUCTION,
    ACCESS_CODE_HMAC_SECRET: process.env.ACCESS_CODE_HMAC_SECRET?.trim(),
    MAX_UPLOAD_SIZE: Number(process.env.MAX_UPLOAD_SIZE) || 100 * 1024 * 1024
};

if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
}

if (!env.ACCESS_CODE_HMAC_SECRET) {
    throw new Error("ACCESS_CODE_HMAC_SECRET is missing");
}