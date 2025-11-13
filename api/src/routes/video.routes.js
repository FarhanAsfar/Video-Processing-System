import {Router} from "express"
import { postVideo, getVideo } from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route('/').post(postVideo);
videoRouter.route('/').get(getVideo)
                                              

export {videoRouter}