import express from "express"
import dotenv from "dotenv"
import {Queue} from "bullmq"
import {PrismaClient} from "@prisma/client"

dotenv.config();

const app = express();
const prisma = new PrismaClient();


app.use(express.json());


const videoQueue = new Queue("video-processing", {
    connection: {host: "redis", port: 6379},
});

app.get("/", (req, res) => {
    res.send("API is running")
});

app.post("/api/videos", async(req, res) => {
    const {filename} = req.body;

    if(!filename){
        return res.status(400).json({
            error: "Filename is required"
        })
    }
    
    //inserting in the database
    const video = await prisma.video.create({
        data: {
            filename,
            status: "queued"
        },
    })

    //enqueuing job
    await videoQueue.add("process", {
        id: video.id,
        filename,
    });

    res.status(200).json({
        message: "Video queued successfully",
        id: video.id
    });
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
});