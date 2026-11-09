import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL error:", error);
});

export async function connectDB() {
    const client = await pool.connect();

    try {
        await client.query("SELECT NOW()");
        console.log("PostgreSQL connected successfully");
    } finally {
        client.release();
    }
}