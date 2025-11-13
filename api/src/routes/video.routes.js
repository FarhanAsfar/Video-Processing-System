import {Router} from "express"
import { postVideo, getVideo } from "../controllers/video.controller.js";
import {upload} from "../middlewares/multer.js"

const videoRouter = Router();

videoRouter.route('/').post(upload.single("video"), postVideo);
videoRouter.route('/').get(getVideo)
                                              

export {videoRouter}