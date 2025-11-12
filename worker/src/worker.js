import dotenv from "dotenv"
import {Worker} from "bullmq"
import {PrismaClient} from "@prisma/client"

dotenv.config();
const prisma = new PrismaClient();

const worker = new Worker(
    "video-processing",

    async job => {
        console.log(`Processing video: ${job.data.filename}`)

        await new Promise(res => setTimeout(res, 5000))

        await prisma.video.update({
            where: {
                id: job.data.videoId
            },
            data: {
                status: 'processed'
            },
        })

        console.log(`Video ${job.data.filename} has been processed`);
    },
    {
        connection: {
            host: "redis",
            port: 6379,
        },
    }
)

worker.on('completed', job => {
    console.log(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed: `, err)
})