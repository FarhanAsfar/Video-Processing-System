import dotenv from "dotenv"
import {Worker, QueueEvents} from "bullmq"
import {PrismaClient} from "@prisma/client"
import fs from "fs/promises"
import path from "path"

dotenv.config();
const prisma = new PrismaClient();

const QUEUE_NAME = process.env.VIDEO_QUEUE_NAME ?? "video-processing";

// directory to save uploaded videos inside worker container
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "/usr/src/app/uploads"

// directory to save processed videos in the cotainer
const PROCESSED_DIR = process.env.PROCESSED_DIR ?? "/usr/src/app/processed";

// redis conneciton info for bullmq
const connection = {
    host: process.env.REDIS_HOST ?? "redis",
    port: Number(process.env.REDIS_PORT ?? 6379),
};

// Worker continuously listens for jobs in the queue and when a job arrives, BullMQ pushes it into this function.
const worker = new Worker(
    QUEUE_NAME,

    async (job) => {
        const { videoId, filename} = job.data;
        console.log(`[worker] picked job ${job.id} and processing video: ${job.data.filename}`);

        //marking video as 'processing' in DB
        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                status: 'processing'
            },
        });

        await new Promise(res => setTimeout(res, 5000));

        //making sure that 'processed' directory exists
        await fs.mkdir(PROCESSED_DIR, {recursive: true});

        const src = path.join(UPLOAD_DIR, filename);

        //destination after processing
        const dest = path.join(PROCESSED_DIR, filename);

        //copying the file for now(temporary)
        await fs.copyFile(src, dest);

        //updating db and marking the job as processed
        await prisma.video.update({
            where: { id: videoId},
            data: { status: "processed"},
        });

        console.log(`[worker] finished job ${job.id} \n`);
        console.log(`Video ${job.data.filename} has been processed`);

        return { ok: true} //returning value stored by bullmq
    },
    {
        connection,
        concurrency: 2,
    }
);

//tracking job events completions and failures
const events = new QueueEvents(QUEUE_NAME, {connection});

events.on('completed', ({jobId}) => {
    console.log(`[worker] job ${jobId} completed`)
})

events.on('failed', ({jobId, failedReason}) => {
    console.log(`[worker] job ${jobId} failed: ${failedReason}`);
});


//making sure worker closes safely on Docker shutdown

const shutdown = async () => {
    console.log("[worker] shutting down...");
    await worker.close(); //stop listening
    await prisma.$disconnect(); //closing db connection
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("[worker] worker started, waiting for jobs...");