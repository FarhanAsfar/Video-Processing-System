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
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniquePrefix + "-" + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (mp4|mov|mkv|avi) are allowed!'));
  }
};

const upload = multer({
    storage,
    limits: {fileSize: 10*1024*1024}, //5mb limit
    fileFilter
})

export {upload};
