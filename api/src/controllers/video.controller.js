import express from "express"
import { videoQueue } from "../jobs/videoQueue.js"
import { PrismaClient } from "@prisma/client"

import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const prisma = new PrismaClient();


export const postVideo = asyncHandler(async (req, res) => {
    const {filename} = req.body;

    if(!filename){
        throw new ApiError(400, "Filename is required", ["File missing"]);
    }

    const video = await prisma.video.create({
        data: {
            filename,
            status: "queued"
        },
    })

    await videoQueue.add("process-video", {
        videoId: video.id,
        filename: video.filename,
    })

    return res.status(201).json(
        new ApiResponse(201, video, "Video queued")
    );
})