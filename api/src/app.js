import express from "express"
import dotenv from "dotenv"
import {Queue} from "bullmq"
import {PrismaClient} from "@prisma/client"

import {videoRouter} from "./routes/video.routes.js"

dotenv.config();

const app = express();
const prisma = new PrismaClient();


app.use(express.json());

app.use("/api/video", videoRouter);

app.get("/", (req, res) => {
    res.send("API is running")
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});