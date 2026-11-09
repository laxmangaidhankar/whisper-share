import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectDB, pool } from "./src/config/db.js";
async function startServer() {
    try {
        await connectDB();

        const server = app.listen(env.PORT, () => {
            console.log(
                `WhisperShare running on port ${env.PORT}`
            );
        });

        const shutdown = async () => {
            console.log("Shutting down server...");

            server.close(async () => {
                await pool.end();
                process.exit(0);
            });
        };

        process.on("SIGTERM", shutdown);
        process.on("SIGINT", shutdown);

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

startServer();