import mongoose from "mongoose";

import app from "./app.js";
import { env } from "./config/env.js";

const startServer = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("MongoDB connected");

        app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
};

startServer();
