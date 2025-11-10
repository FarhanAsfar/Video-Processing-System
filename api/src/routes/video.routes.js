import {Router} from "express"
import { videoQueue } from "../jobs/videoQueue.js"
import { PrismaClient } from "@prisma/client"
import { postVideo, getVideo } from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route('/').post(postVideo);
videoRouter.route('/').get(getVideo)


export {videoRouter}