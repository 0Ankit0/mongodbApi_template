import { Router } from "express";
import express from "express";
import multer from "multer";

const uploadRouter = Router();
var router = express();
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
    const fileUrl = req.file.path;
    res.send(`File uploaded successfully. File URL: ${fileUrl}`);
});
uploadRouter.post("/files", upload.array("files"), (req, res) => {
    // Files have been uploaded and saved in the "uploads" folder 
    const fileUrls = req.files.map(file => file.path);
    res.send(`Files uploaded successfully. File URLs: ${fileUrls.join(", ")}`);
});

export default uploadRouter;