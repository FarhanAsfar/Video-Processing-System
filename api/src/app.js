import express from "express"
import dotenv from "dotenv"
import {PrismaClient} from "@prisma/client"

import {videoRouter} from "./routes/video.routes.js"
import { errorHandler } from "./middlewares/error.middleware.js"

dotenv.config();

const app = express();
const prisma = new PrismaClient();


app.use(express.json());

app.use("/api/videos", videoRouter);

app.get("/", (req, res) => {
    res.send("API is running")
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});