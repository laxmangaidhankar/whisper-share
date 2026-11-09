
import {
    randomInt,
    createHmac,
    timingSafeEqual
} from "node:crypto";

import { env } from "../config/env.js";

const CODE_LENGTH = 6;

// Avoid confusing characters: 0/O, 1/I
const CHARACTERS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const HMAC_SECRET = env.ACCESS_CODE_HMAC_SECRET;

if (!HMAC_SECRET) {
    throw new Error("ACCESS_CODE_HMAC_SECRET is not configured");
}

// Generate a cryptographically secure random code
export function generateAccessCode() {
    let code = "";

    for (let i = 0; i < CODE_LENGTH; i++) {
        const randomIndex = randomInt(CHARACTERS.length);
        code += CHARACTERS[randomIndex];
    }

    return code;
}

// Generate deterministic HMAC-SHA256 hash
export function hashAccessCode(code) {
    const normalizedCode = code.trim().toUpperCase();

    if (
        normalizedCode.length !== CODE_LENGTH ||
        [...normalizedCode].some(char => !CHARACTERS.includes(char))
    ) {
        throw new Error("Invalid access code format");
    }

    return createHmac("sha256", HMAC_SECRET)
        .update(normalizedCode, "utf8")
        .digest("hex");
}

// Compare two hashes safely
export function verifyAccessCode(code, storedHash) {
    try {
        const calculatedHash = hashAccessCode(code);

        const calculatedBuffer = Buffer.from(calculatedHash, "hex");
        const storedBuffer = Buffer.from(storedHash, "hex");

        if (calculatedBuffer.length !== storedBuffer.length) {
            return false;
        }

        return timingSafeEqual(calculatedBuffer, storedBuffer);
    } catch {
        return false;
    }
}
