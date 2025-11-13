import multer from "multer"
import fs from "fs"
import path from "path"

const tempDir = path.resolve("uploads/");
if(!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
})

const upload = multer({
    storage,
    limits: {fileSize: 5*1024*1024} //5mb limit
})

export {upload};
