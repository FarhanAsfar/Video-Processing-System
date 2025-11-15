import {Router} from "express"
import { postVideo, getVideos, getVideoById } from "../controllers/video.controller.js";
import {upload} from "../middlewares/multer.js"

const videoRouter = Router();

videoRouter.route('/upload').post(upload.single("filename"), postVideo);
videoRouter.route('/').get(getVideos);
videoRouter.route('/:id').get(getVideoById);
                                              

export {videoRouter}