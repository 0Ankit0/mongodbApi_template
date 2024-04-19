import { Router } from "express";
import express from "express";
import multer from "multer";

const uploadRouter = Router();
var app = express();
router.get('/', async (req, res) => { //this is /upload/index page
    res.send("Welcome to the upload page");
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

uploadRouter.post("/file", upload.single("file"), (req, res) => {
    // File has been uploaded and saved in the "uploads" folder
    res.send("File uploaded successfully");
});
uploadRouter.post("/files", upload.array("files"), (req, res) => {
    // Files have been uploaded and saved in the "uploads" folder 
    res.send("Files uploaded successfully");
});

export default uploadRouter;