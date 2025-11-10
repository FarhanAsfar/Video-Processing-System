import {Router} from "express"
import { videoQueue } from "../jobs/videoQueue.js"
import { PrismaClient } from "@prisma/client"
import { postVideo } from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route('/').post(postVideo);



export {videoRouter}