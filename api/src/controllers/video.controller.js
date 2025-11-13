import { videoQueue } from "../jobs/videoQueue.js"
import { PrismaClient } from "@prisma/client"

import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const prisma = new PrismaClient();


export const postVideo = asyncHandler(async (req, res) => {
    const {filename} = req.file;

    if(!filename){
        throw new ApiError(400, "File is required", ["No file uploaded"]);
    }

    const createVideo = await prisma.video.create({
        data: {
            filename,
            status: "queued"
        },
    })

    // pushing the file in a queue
    await videoQueue.add("process-video", {
        videoId: createVideo.id,
        filename: createVideo.filename,
    })

    return res.status(201).json(
        new ApiResponse(201, createVideo, "Video queued")
    );
});

export const getVideo = asyncHandler(async(req, res) => {
    const allVideos = await prisma.video.findMany();

    return res.status(200).json(
        new ApiResponse(200, allVideos, "List of videos")
    );
})