import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

export const videoQueue = new Queue('video-processing', {
    connection: {
        host: 'redis',
        port: 6379,
    },
});